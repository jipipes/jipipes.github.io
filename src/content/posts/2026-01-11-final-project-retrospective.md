---
title: "Final Project Retrospective: What Good Collaboration Sounds Like"
date: 2026-01-11
categories: [Engineering Retrospectives]
tags: [project, retrospective, soft-skill]
description: "The best team I've worked with, the quiet guilt of feeling like I wasn't contributing enough, and what I want to do differently next time."
---

### The Setup

Our final project was an automated data pipeline built on AWS. The technical side (infrastructure decisions, troubleshooting, the parts that broke) is covered separately. This is about the team, and about a pattern in myself I only recognized once the project was already over.

It was, by a clear margin, the best team I've worked with across all four projects. That's worth writing about on its own.

---

### What a Good Team Actually Sounds Like

I'd read plenty of advice about how to disagree productively in a team. This was the first project where I watched it actually happen, consistently, from more than one person:

- *"I think X about this part. What do the rest of you think?"* instead of stating a position as settled.
- *"Since you're currently handling A, would it be okay to ask you about B?"* instead of assuming availability.
- Acknowledging small contributions out loud instead of letting them pass unremarked, even when it would've been easy to just move on.

We also built in structure ahead of time instead of relying on goodwill in the moment: the project was split into domains, each with an assigned owner. When opinions clashed, the default was to defer to that domain's owner, or bring it to our mentor, not relitigate it as a group every time. It sounds procedural written out like this, but it removed a surprising amount of friction before it ever started.

This is the version of collaboration I want to replicate on every team after this, not because it was pleasant, but because it was visibly faster than the alternative. We placed 2nd out of 8 teams, and I don't think that happened by accident. It came from how we worked together.

---

### Mostly Alone With the Same Set of Questions

My part of the project ended up fairly isolated. Most of my teammates only had SSH access, not console access, so a lot of the day-to-day problem-solving landed on me by default rather than by discussion. I don't think anyone intended for it to work that way. It's just what happens when one person holds the access and everyone else doesn't.

That isolation is the setup for the part of this project I actually want to write about.

---

### The Guilt I Didn't Say Out Loud

We worked online through Christmas. It was genuinely one of the more interesting stretches of the project. I spent a lot of it quietly asking myself whether I was actually contributing, or just in the way.

That question made me more passive than I needed to be. I pulled back instead of asking directly, which is the opposite of useful when a team is relying on shared visibility to move fast. No one on the team ever said or implied I wasn't contributing. That doubt was entirely something I generated on my own, and I let it decide how much I spoke up.

Looking back, that's the part I regret most about this project: not a technical decision, but a stretch of staying quiet when I should have said what I was unsure about.

---

### How I Want to Carry Myself Next Time

Naming the regret isn't the same as fixing it, so I tried to work out what I'd actually do differently. Not as a slogan, but as something specific enough to check myself against next time.

The pattern I noticed: I went quiet exactly when I was least sure whether I was doing enough, which is backwards. Uncertainty is the moment sharing matters *most*, not the moment it feels safest to withhold. So the standard I want to hold myself to isn't "speak up when I have something impressive to show." It's "say what I'm doing and what I'm unsure about, on a cadence, regardless of how it looks."

Concretely, three things I want to do differently:

1. **Share work in progress, not just finished work.** If I'm heads-down on something for more than a day, that's the signal to post an update, not wait until it's done enough to look competent.
2. **Ask "am I actually blocked, or just uncomfortable?" before going quiet.** Most of my silence in this project wasn't caused by not knowing what to do. It was caused by not wanting to ask and look like I didn't.
3. **Treat "I don't know" as a status update, not a confession.** Saying it early costs almost nothing. Saying it late, after a week of quiet struggling, costs the team time they didn't know they needed to spend.

None of this is about being loud by default. It's about not letting my own doubt decide, on the team's behalf, how much information they get.

---

### What the Data Actually Taught Me

Even working with public data, the effort that went into parameter tuning and cleaning surprised me. I wasn't leading that part of the work, but I spent real time in the planning stage for data modeling and cleaning, and came out with a much clearer sense of how I'd approach it if I were leading it next time.

The part I enjoyed most: each of us owned a different API, collecting and inspecting the data individually before it came together. Working from a dataset that's already been assembled hides this entirely. You don't feel that *how you bring data in* is itself the first engineering decision, not a preamble to the real work.

---

### Looking Ahead

This project is where I actually saw a full data pipeline run end-to-end, design through implementation, not a diagram of how it's supposed to work. Next, I want to work on something larger in scope, or closer to real-time, as the data engineer working alongside people in other roles (frontend, backend, product), instead of a team where everyone's doing a version of the same job.

---

### TL;DR

- Best team so far: collaboration built on explicit domain ownership and default-to-owner conflict resolution, not just good intentions in the moment.
- Ended up isolated by an access constraint (SSH-only teammates), which meant most day-to-day problem-solving landed on me by default.
- Went quiet over Christmas out of self-generated doubt about my own contribution, not anything the team actually said. That was the biggest regret of the project.
- Concrete standard for next time: share work in progress on a cadence, ask whether I'm actually blocked or just uncomfortable before going quiet, and treat "I don't know" as a status update, not a confession.
- Owning data collection per-API (not a pre-assembled dataset) made clear that how data gets in is itself an engineering decision.
- Next goal: a larger-scope or real-time project working as the data engineer alongside other functions, not a team of interchangeable roles.