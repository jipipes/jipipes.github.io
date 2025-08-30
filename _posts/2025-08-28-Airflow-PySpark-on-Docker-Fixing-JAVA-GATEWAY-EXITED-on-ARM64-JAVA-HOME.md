---
layout: post
title: "Airflow + PySpark on Docker: Fixing JAVA_GATEWAY_EXITED on ARM64 JAVA_HOME (DE101 Setup Error #2)"
categories:
    - Problem Solving
date: 2025-08-28
---

## TL;DR
1. Root cause: path mismatch — Spark expected Java at …/java-17-openjdk-amd64, but Java was installed under ARM64 at …/java-17-openjdk-arm64.

2. Fix: set JAVA_HOME to the actual install path and make sure the scheduler container (LocalExecutor) uses the same custom image that contains Java/Spark.

3. Process: read the full log from the top, extract the one-line root cause, and then validate environment vs. code with preflight checks.

---

### Context

I re-ran my Airflow DAG to chase a stubborn failure I couldn’t fix last time. My previous mistake? I trusted my guesses more than the logs, skimmed only the bottom part, and missed where the error actually started. This time I forced myself to read top-to-bottom and summarize the error in one line.

### Key errors

```yaml
/opt/spark/bin/spark-class: line 71: /usr/lib/jvm/java-17-openjdk-amd64/bin/java: No such file or directory
```
```yaml
pyspark.errors.exceptions.base.PySparkRuntimeError: [JAVA_GATEWAY_EXITED] Java gateway process exited before sending its port number.
```

One-line diagnosis: PySpark couldn’t start because Java wasn’t found at the path Spark expected (wrong JAVA_HOME).

---

### What I checked (and what was wrong)

#### 1) ENV vs export in Dockerfile

I had environment variables like this:
```yaml
ENV JAVA_HOME='/usr/lib/jvm/java-17-openjdk-amd64'
ENV PATH=$PATH:$JAVA_HOME/bin
ENV SPARK_HOME='/opt/spark'
ENV PATH=$PATH:$SPARK_HOME/bin:$SPARK_HOME/sbin
```

I replaced them with a single explicit PATH to avoid interpolation issues during build:
```yaml
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV SPARK_HOME=/opt/spark
ENV PATH="/usr/lib/jvm/java-17-openjdk-amd64/bin:/opt/spark/bin:/opt/spark/sbin:$PATH"
```

| **Why ENV over export**: export only affects the current shell (RUN layer) and evaporates in the next layer. ENV persists in the built image and is available to Airflow tasks.

#### 2) Which container actually runs tasks?

I’m using LocalExecutor, so the scheduler runs the tasks (not the webserver). That means Java/Spark must exist in the scheduler container, not just the webserver.

I validated inside the scheduler:
```yaml
docker exec -it <scheduler-container> bash
whoami
echo $JAVA_HOME
which java
java -version
ls -l /usr/lib/jvm
```
![terminal screenshot](/assets/img/post-2025-08-28-0.jpg)

Finding: Java was installed at:
> /usr/lib/jvm/java-17-openjdk-arm64

…but Spark was trying to use:
> /usr/lib/jvm/java-17-openjdk-amd64/bin/java

— classic arch mismatch (ARM64 vs AMD64).

---

### The fix

#### 1) Point JAVA_HOME to the real path (ARM64)

```yaml
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64
ENV SPARK_HOME=/opt/spark
ENV PATH="/usr/lib/jvm/java-17-openjdk-arm64/bin:/opt/spark/bin:/opt/spark/sbin:$PATH"
```

#### 2) Ensure every Airflow service uses the same custom image

If you build Java/Spark into a custom image, use it for webserver, scheduler, triggerer, and worker (if any). 
Example:
```yaml
x-airflow-image: &airflow-image
  build:
    context: .
    dockerfile: airflow/Dockerfile
  image: myrepo/airflow-spark:0.1

services:
  airflow-webserver:
    <<: *airflow-image
    # ...

  airflow-scheduler:
    <<: *airflow-image
    # ...

  airflow-triggerer:
    <<: *airflow-image
    # ...

  # If using CeleryExecutor
  airflow-worker:
    <<: *airflow-image
```

---

### Result
- The DAG executed successfully after fixing JAVA_HOME to the ARM64 path.

- Spark jobs started correctly (no more JAVA_GATEWAY_EXITED).

- I also verified my dbt docs web UI came up as expected.

---

### Screenshots

![Airflow DAG ran sucessfully](/assets/img/post-2025-08-28-1.jpg)

![dbt docs opened sucessfully](/assets/img/post-2025-08-28-2.jpg)

---

### What I’ll do differently next time

- Read full logs in chronological order before touching anything.

- Reduce the error to one sentence; then pick the right search terms:
"PySpark JAVA_GATEWAY_EXITED", "SparkContext getOrCreate Java not found", "JAVA_HOME mismatch arm64".

- Confirm which service actually runs the task (scheduler/worker) and debug there.

- Add a preflight task for environment checks in Airflow.

- Keep Dockerfile defensive: explicit ENV, correct JDK (not JRE-only), consistent image across services.

---

### Notes & gotchas (ARM Macs, mixed arch)

- amd64 vs arm64 matters. On Apple Silicon, your base image and packages may resolve to ARM64. Verify the actual Java install directory under /usr/lib/jvm/.

- Install JDK (openjdk-17-jdk), not just jre-headless. Spark tooling expects the full JDK.

- After Dockerfile changes, always do:
```yaml
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```
and validate in the scheduler container:
```yaml
docker exec -it <scheduler> bash -lc 'echo $JAVA_HOME && java -version && spark-submit --version'
```
