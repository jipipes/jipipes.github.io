---
layout: post
title: "Airflow + PySpark on Docker: Debugging JAVA_GATEWAY_EXITED (DE101 Setup Error #1)"
categories:
    - Problem Solving
date: 2025-08-22
---

### TL;DR Takeaway:
Setting up your environment as a data engineer can be brutal.  
From port conflicts and memory limits to Docker image issues and JVM errors
this post breaks down the gauntlet I ran while trying to configure Airflow + PySpark locally.

**Key takeaways:**
- PySpark errors are often caused by JVM startup failures, not Python bugs.
- Docker’s platform, memory, and port settings weren’t the confirmed cause, but they were worth inspecting — subtle misconfigurations here can cause silent failures.
- Don't just kill processes—**inspect, understand, and configure.**
- Sometimes “it kind of works” isn’t good enough—you’ll regret skipping it later.
- **Next step:** I plan to explicitly define `JAVA_HOME` to test whether manual JVM path configuration resolves the issue.

Every setup pain teaches you something.  
You either learn to control the environment—or get controlled by it.

Development Environment:
>OS: macOS (M1)

>Docker: v24.x

>Airflow: v2.8 (Docker-based)

>PySpark: v3.5

### 1. Inspecting Airflow Logs & Initial Diagnosis
The issue occurred when a PySpark task in an Airflow DAG failed with a JAVA_GATEWAY_EXITED error. I began by troubleshooting the Airflow error by examining the logs.
![Airflow DAG failure log screen](/assets/img/post-2025-08-22-0.jpg)


The core error message was:
>pyspark.errors.exceptions.base.PySparkRuntimeError: [JAVA_GATEWAY_EXITED] Java gateway process exited before sending its port number.

I found that this error frequently occurs when integrating PySpark with Airflow. 
It means that the PySpark process (Python) tried to launch a Spark process (Java-based) but the Java process failed to start, so communication couldn't be established.
This indicated that the problem was likely not with the code itself, but with the environment where Spark's Java Virtual Machine (JVM) process was being launched. 

### 2. Docker Memory Limitation?
To accurately diagnose the issue, I went through the following steps.

First, I considered that since the environment was pre-built for the course, the problem might be on my local machine. 
I wondered if it was due to a lack of resources. I checked my Docker settings and found the Memory limit was set to 4GB. 
I wasn’t sure if this was the problem but since it was a minimal setting, I increased it to 8GB.

![Docker resource configuration view](/assets/img/post-2025-08-22-1.jpg)

However, the DAG still failed with the same error.

### 3. Checking CPU Architecture
Next, I considered whether the issue was due to my local CPU architecture. 
My Mac uses an ARM64 architecture, while the image might be based on x86_64. 
To remove this variable, I added: 
>platform: linux/amd64
to the docker-compose.yml file and then rebuilt and re-ran the container. Still-no luck.

### 4. Docker Image or Build Error
This resulted in a new error: 
>Docker could not find the necessary files to build the image. 
What was wrong? I re-examined the file but couldn't find the issue. I decided to get help from an AI assistant. 
It explained that having both the image: tabulario/spark-iceberg and build: spark/ lines together was the problem. Docker prioritizes the build: command, and it threw an error because it couldn't find the spark/ folder.

### 5. Containter Name Conflict + Port Issues
I also encountered a container name conflict error:

>Error response from daemon: Conflict. The container name "/minio" is already…

I resolved this by deleting the old container and trying again: 
>docker rm -f minio

### 6. Docker Daemon Connection Failure
Then, another error occurred:

>Error response from daemon: failed to set up container networking: driver failed programming external connectivity on endpoint...: Bind for 0.0.0.0:8080 failed: port is already allocated

This was a port conflict. I knew I needed to find the program using that port, so I used lsof -i :8080 to find the process ID (PID) and then terminated it with kill -9.
But yet another error appeared. At this point, I started to wonder if I was doing something fundamentally wrong. Docker was running, but it wasn't responding. I restarted the Docker engine and the port conflict error reappeared. I realized my previous fix had created an endless loop of errors.
![Docker error screen](/assets/img/post-2025-08-22-2.jpg)

### 7. Facing a Cycle of Port Conflict & Restart
I rethought my approach. Instead of reckless killing of processes, I decided to simply change ports. I updated docker-compose.yml from:
>ports:
  - "8080:8080"

to

>ports:
  - "8082:8080"

Still, Docker complained that port 8081 was also in use. I checked the port allocation using:
>docker ps
Turns out Airflow was binding both ports.
![docker ps](/assets/img/post-2025-08-22-3.jpg)

### 8. Final Fix
I iterated port changes until finding a free one. After trying 10002:10000, the docker-compose up -d command finally worked without port-binding errors. Yet, frustratingly, the DAGs still failed.


<details>
<summary><strong>Reflection</strong></summary>

I’ve been here before—stuck in a frustrating loop of errors during project.
<br>Even though I’ve promised myself to study harder and improve my ability to troubleshoot,
I still find myself shrinking in the face of yet another error.
<br>It’s especially discouraging when I face this kind of wall just trying to set up an environment to learn.

<br><br>Sure, I could’ve cut corners this time too.
The local server was kind of running.
<br>I could’ve said, “Let’s just move on and come back to it later.”
But that’s not how I work.
<br>The DAG has to run successfully, otherwise I can’t properly check the dbt layer—and that’s part of the whole process I’m trying to learn.
<br>Skipping past this would just leave a hole in my understanding.

<br><br>This time, I was reminded again of how Docker’s platform configuration, system resource limits, and PySpark’s deep dependency on the JVM all interact.
<br>It wasn’t just a missing package—this was about system compatibility.

<br><br>From now on, I’ll be more proactive about things like setting JAVA_HOME manually or explicitly managing system variables.
<br>Every painful error I face is one more step toward becoming a stronger, more resilient developer.

</details>

