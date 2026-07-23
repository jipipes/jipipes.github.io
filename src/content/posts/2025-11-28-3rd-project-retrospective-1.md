---
title: "3rd Project Retrospective: A DAG, a Permission Wall, and a Dashboard That Still Didn't Say Much"
date: 2025-11-28
categories: [Bootcamp]
tags: [project, retrospective, airflow, snowflake]
description: "Splitting one DAG into two independent chains, a permission failure that turned out to be about least privilege, and a dashboard that worked without saying anything."
---

### The Setup

Our third project moved us from single-owner datasets to something closer to a real pipeline: collecting, cleaning, and loading the dollar index (DXY) and WTI crude oil prices hourly, orchestrated with Airflow on Docker. Everyone's output eventually landed in the same Snowflake instance, and from there into Preset for visualization.

It was the first project where I had to make engineering decisions instead of executing someone else's structure. This half of the retrospective is about the technical calls. The next post covers the team dynamics that turned out to matter just as much.

---

### My First Modular DAG

Up to this point I'd only worked inside DAGs someone else had already structured. This time I wrote one from scratch, running hourly, and the first real decision I made was where to draw the boundaries:

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
from src.dollarindex_wti.extract_dxy_yfinance import fetch_dxy_yfinance
from src.dollarindex_wti.extract_wti_yfinance import fetch_wti_yfinance
from src.dollarindex_wti.transform_wti_dxy import transform_dxy, transform_wti
from src.dollarindex_wti.load_wti_dxy import upload_raw_to_s3, upload_processed_to_s3
from src.dollarindex_wti.load_wti_dxy_to_snowflake import run_dxy_snowflake_load, run_wti_snowflake_load

def run_dxy_etl():
    df_raw = fetch_dxy_yfinance()
    upload_raw_to_s3(df_raw, "dxy")
    df_processed = transform_dxy(df_raw)
    upload_processed_to_s3(df_processed, "dxy")

def run_wti_etl():
    df_raw = fetch_wti_yfinance()
    upload_raw_to_s3(df_raw, "wti")
    df_processed = transform_wti(df_raw)
    upload_processed_to_s3(df_processed, "wti")

default_args = {"owner": "soojin", "retries": 1, "retry_delay": timedelta(minutes=5)}

with DAG(
    dag_id="dxy_wti_pipeline",
    default_args=default_args,
    schedule_interval="0 * * * *",  # hourly
    start_date=datetime.now() - timedelta(hours=1),
    catchup=False,
) as dag:
    dxy_task = PythonOperator(task_id="run_dxy_etl", python_callable=run_dxy_etl)
    wti_task = PythonOperator(task_id="run_wti_etl", python_callable=run_wti_etl)
    load_dxy_snowflake = PythonOperator(task_id="load_dxy_snowflake", python_callable=run_dxy_snowflake_load)
    load_wti_snowflake = PythonOperator(task_id="load_wti_snowflake", python_callable=run_wti_snowflake_load)

    dxy_task >> load_dxy_snowflake
    wti_task >> load_wti_snowflake
```

Two decisions drove the structure. 

First, DXY and WTI run as fully independent chains rather than one merged pipeline — a bad fetch on one source shouldn't stall or corrupt the other, and since they're unrelated instruments, there's no reason to force them into the same failure domain. 

Second, extract, transform, and load each live in their own module (`extract_dxy_yfinance.py`, `transform_wti_dxy.py`, `load_wti_dxy.py`, `load_wti_dxy_to_snowflake.py`), and loading to Snowflake is its own task, separate from the extract-transform-upload step. So a load failure retries just the load instead of re-fetching and re-transforming everything upstream.

A teammate later told me they used this DAG as a reference for their own, because it was easy to see which source had failed. That claim needs a caveat, though: the graph tells you *which source* failed, not *which stage*. Extract, transform, and both S3 uploads are bundled into one Python callable per source, so if something breaks partway through, you still have to open the task log to find out where — the module-level split makes the code readable, but it doesn't buy you stage-level visibility in the Airflow UI. Those are two different kinds of modularity, and I conflated them at the time.

**Something I'd fix now:** `start_date=datetime.now() - timedelta(hours=1)` is a known Airflow anti-pattern. Because it's evaluated every time the DAG file is parsed, the start_date silently drifts on every scheduler heartbeat, which can produce inconsistent scheduling behavior. It ran fine for the length of the project, but a static start_date (`datetime(2025, 12, 1)`, for instance) is the version I'd write today.

---

### The Permission Wall

Every team member loaded their processed data into the same Snowflake instance. Straightforward enough, until I tried pulling one of those datasets into Preset and got nothing but a failed connection.

I spent the better part of a day tracing it before the pattern pointed at permissions: the role Preset was querying under didn't have visibility into that schema. My first instinct was to ask for broader access so the problem would just go away. Our team lead pushed back hard on that.

At the time, that felt like the debugging session getting blocked by a decision that had nothing to do with debugging. In hindsight, the instinct behind the pushback was closer to correct than mine was. The actual fix wasn't a wider grant — it was a scoped one: read access to the specific schema Preset needed, nothing account-wide. Same result, smaller surface.

**Takeaway:** "It would work if I had more access" is usually true and usually not the question worth asking. The better question is what the smallest grant is that makes it work — and that question takes longer to answer, which is exactly why it's tempting to skip.

---

### The Dashboard That Still Didn't Say Much

The Preset dashboard we shipped functioned. What it was supposed to help someone conclude stayed fuzzy the whole way through — partly because we never nailed the spec down early enough, and partly because real-time metrics and batch-updated metrics sat side by side on the same view, which made any coherent narrative harder to hold together.

It worked. It didn't clearly say anything. If dashboard design and insight framing turn out to matter for the direction I want to take, that's a skill I'll need to build on purpose — it isn't a byproduct of building enough pipelines.

---

### TL;DR

- Wrote my first DAG as independent per-source chains (DXY / WTI), each with extract/transform/load split into separate modules and Snowflake loading as its own retryable task.
- Realized after the fact that source-level modularity in the graph isn't the same as stage-level visibility — a teammate could tell which source failed, not which step, without reading logs.
- `start_date=datetime.now() - ...` is an anti-pattern I'd fix if I rewrote this today; static start dates avoid scheduling drift.
- A Preset-Snowflake permission failure ate most of a day. The instinct to ask for broader access was wrong; the fix was a narrowly scoped grant — least privilege as a real design constraint, not a bureaucratic obstacle.
- Shipped a working dashboard that still didn't deliver clear insight, partly due to mixing real-time and batch metrics. Insight framing is a skill I need to build deliberately.