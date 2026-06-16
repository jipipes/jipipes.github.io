---
title: "2nd Project Retrospective: When Insight Isn't Enough"
categories:
    - Bootcamp
tags:
    - project
    - retrospective
date: 2025-11-02
description: "I owned a dataset with nothing to engineer. The dashboard succeeded. My contribution barely showed. What I learned wasn't technical. It was about what kind of work I actually want to do."
---

### The Setup: Data Without Drama

Our team of four each pitched topic ideas, narrowed them to two candidates, explored the data, and voted on a final direction.

As team lead, I came in prepared: compiled references, watched YouTube breakdowns of similar projects, and built out a structured proposal deck. On voting day, we landed on two options: one that was overly generic, one that had already been done by a previous cohort. Neither was what I had pitched.

I set that aside and focused on what I could learn from whichever direction we went.

We split into pairs to research both candidates. The final theme was decided, and it wasn't the one I'd been assigned. I ended up owning a supporting dataset: **monthly heatwave and cold wave statistics from Korean public records.**

| Attribute | Detail |
|---|---|
| Source | Public government report |
| Update frequency | Monthly |
| Format | CSV |
| Volume | Few rows, few columns |
| Engineering required | None |

I pushed to extract something useful. I tracked down disease and mortality figures linked to extreme weather events to surface as big-number metrics. The data barely supported it. In the end, my pipeline looked like this:

```
Download CSV → Load into Snowflake (no transformation) → Aggregate in Preset
```

No cleaning. No orchestration. No engineering decision made.

---

### Going All-In on Ideas (That No One Wanted)

With little to do on the technical side, I redirected energy into planning.

I put together 10+ proposals: visualizations we could build, narrative angles, dashboard structures. I researched what makes dashboards genuinely useful beyond aesthetics. The ideas were feasible. None of them required anything technically out of reach.

The reception was flat. No pushback, no iteration, no momentum. Meetings ran long without resolution.

Part of that was on me. As team lead, I had overcorrected from the 1st project by prioritizing open discussion to the point where decisions kept getting deferred.

| What I tried | What actually happened |
|---|---|
| Open discussion, everyone speaks | Meetings ran too long |
| No pressure to decide immediately | Decisions kept getting deferred |
| Flat hierarchy in planning | No one called time |

**Takeaway:** Psychological safety and decisiveness aren't opposites, but balancing them requires explicit structure. Next time: time-box discussions, assign a decision deadline, move.

---

### The Dashboard Looked Great. My Contribution Didn't Show.

The final dashboard was solid. Clean visualizations, coherent storytelling, polished Preset layout. By any external measure, the project worked.

My contribution represented less than 10% of what was on screen. Being generous.

Reviewing what I had actually done:

- ✅ Downloaded a CSV
- ✅ Loaded it into Snowflake without transformation
- ✅ Built two Preset charts from aggregated data
- ❌ No pipeline design
- ❌ No data modeling
- ❌ No automation
- ❌ No engineering tradeoff made

The issue wasn't that my dataset was small. It was that there was no engineering problem to solve. And without that, I had no idea what I was supposed to be learning.

---

### What This Project Clarified

The disengagement toward the end of this project is something I own. Pulling back when things feel unrewarding isn't a strategy. It just makes things worse for the team. That's a pattern I'm actively working on.

But the project did surface something useful: a clearer picture of where my interest actually sits.

**On the type of work:**

| Question | My reaction |
|---|---|
| "What insight should we surface, and how do we visualize it?" | Low engagement |
| "How should data flow from source to warehouse, and what needs to happen along the way?" | High engagement |

That gap is meaningful. I'm not drawn to the output layer. I'm drawn to the pipeline.

**On team structure:**

This project had everyone owning a slice of the same role, differentiated only by which dataset they handled. In practice, it felt less like collaboration and more like parallel solo work that happened to end up in the same dashboard.

What I actually want: a team where roles are genuinely different, where a handoff between people means something technically.

The 2nd project didn't tell me what I wanted to do. It told me what I didn't. That was enough to go into the final project with a clearer direction.

---

### TL;DR

- Owned a minimal public dataset (monthly CSV, zero transformation needed). No real engineering work done.
- Pitched 10+ planning ideas as team lead. Low reception, long meetings. Learned that open discussion without structure just delays decisions.
- Final dashboard was a success. My contribution was barely visible, and reviewing the checklist of what I actually built made that hard to ignore.
- Key realization: I care about pipeline design and data flow, not visualization and insight delivery. That distinction carried into the final project.
