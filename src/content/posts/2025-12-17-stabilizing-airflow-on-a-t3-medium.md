---
title: "Stabilizing Airflow on a t3.medium: From OOM Freezes to Concurrency Tuning"
date: 2025-12-17
categories: [Debugging]
tags: [airflow, aws, ec2, debugging]
description: "An EC2 t3.medium kept freezing under Airflow. Kernel logs pointed to the OOM killer, not a hang, and swap memory alone wasn't the fix."
---

## TL;DR

1. Root cause: the EC2 instance wasn't hanging. The kernel's OOM killer was silently terminating processes because Airflow's default settings asked for more memory than a t3.medium (3.7GiB) had to give.
2. First fix (partial): adding 2GB of swap resolved UI access, but workflows still failed. Airflow's default `AIRFLOW__CELERY__WORKER_CONCURRENCY: 16` was still oversubscribing the instance.
3. Real fix: dropping worker concurrency to 2 to match actual hardware. Swap bought headroom; concurrency tuning fixed the actual oversubscription.

---

### Context

After validating an Airflow + Docker Compose setup locally, I migrated it to an EC2 t3.medium instance. The first time I opened the Airflow Web UI to register connection info (DB and API credentials), the page hung indefinitely and the entire instance stopped responding. I force-restarted it and tried the same registration through the CLI instead of the UI, assuming the web server was the problem. Same freeze. That ruled out the UI itself as the cause.

---

### Checking memory usage

```bash
$ free -h
```

![free -h output showing high memory usage](/assets/img/post-2025-12-17-0.png)

Of 3.7GiB total memory, 78% (2.9GiB) was already in use, with only ~577MiB available.

### Confirming it was OOM, not a hang

```bash
# OOM-related errors from syslog
sudo grep -i "out of memory \|oom\|kill" /var/log/syslog > /tmp/oom_check.log
# OOM-related errors from the kernel log
sudo grep -i "out of memory \|oom\|kill" /var/log/kern.log >> /tmp/oom_check.log
# Live kernel ring buffer, same search
sudo dmesg | grep -i "out of memory \|oom\|kill" >> /tmp/oom_check.log
# Review
grep -i "killed process" /tmp/oom_check.log
grep -B 5 -A 5 "Out of memory" /tmp/oom_check.log
```

![kernel logs showing OOM killer activity](/assets/img/post-2025-12-17-1.png)

One-line diagnosis: this wasn't a frozen instance. The kernel's OOM killer was terminating processes under memory pressure, which looked identical to a hang from the outside.

---

### Fix, part 1: swap memory

```bash
# 1. Create a 2GB file to back the swap space
sudo fallocate -l 2G /swapfile
# 2. Restrict permissions to owner read/write only
sudo chmod 600 /swapfile
# 3. Format the file as Linux swap
sudo mkswap /swapfile
# 4. Enable it immediately
sudo swapon /swapfile
# 5. Persist it across reboots
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
# 6. Confirm
free -h
```

![free -h output after enabling swap](/assets/img/post-2025-12-17-2.png)

**Result (partial):** Connection registration succeeded this time. But once DAGs actually started running, 36 workflows spun up and none of them executed.

![36 workflows stuck without executing](/assets/img/post-2025-12-17-3.png)

Checking the worker logs:

```bash
docker logs threelacha_airflow_dbt-airflow-worker-1 --tail=50
```

![worker logs showing SIGKILL](/assets/img/post-2025-12-17-4.png)

`Process 'ForkPoolWorker-1' exited with 'signal 9 (SIGKILL)'`. Swap fixed the UI freeze, but Airflow's default concurrency (`concurrency: 16`, prefork) was still asking for more parallel workers than a t3.medium could actually run.

---

### Fix, part 2: right-sizing concurrency

```yaml
airflow-worker:
    environment:
      <<: *airflow-common-env
      AIRFLOW__CELERY__WORKER_CONCURRENCY: 2  # concurrent Celery tasks
```

**Result:**

![DAGs running successfully after concurrency fix](/assets/img/post-2025-12-17-5.png)

| | Item | AS-IS | TO-BE |
|---|---|---|---|
| EC2 OS | Swap memory | None | 2GB |
| docker-compose.yml | `AIRFLOW__CELERY__WORKER_CONCURRENCY` | 16 | 2 |

---

### Why this mattered

- **Stability:** the OOM-killer-driven freezes were root-caused and fixed at the source, instead of working around them with restarts.
- **Predictability:** matching concurrency to actual hardware cut down on resource contention and raised the pipeline's success rate, with no more silently-dead workflows.
- **Cost:** the fix was configuration, not a bigger instance. Jumping to a t3.large would have solved it too, at a recurring cost, for a problem that was actually about defaults, not capacity.

---

### What I'd look at next

- **LocalExecutor:** since this is a single-node setup, LocalExecutor would drop the need for a separate message broker (Redis) entirely and free up more memory for actual task execution.
- **Scale-out / MWAA:** splitting the worker component onto its own instance, or moving to AWS's managed Airflow (MWAA), would reduce the operational burden of tuning this by hand, and is probably the change that would have prevented this incident in the first place rather than just recovering from it.