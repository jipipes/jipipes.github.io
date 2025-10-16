---
layout: post
title: "1st Project Retrospective -Beyond Code"
categories:
    - Bootcamp
date: 2025-10-02
description: "A reflection on my first team project — learning that collaboration matters more than perfect code."
---

### Project 1: Building a Visualization Web Service with Scraped Data

When our data engineering bootcamp team was asked to build a visualization web service using crawled data, I chose the least popular role — **the Frontend**.

It wasn’t a random choice. While setting up my personal blog with GitHub Pages, I realized that even the most sophisticated backend loses meaning if the data isn’t presented through a clear, intuitive interface. Since three more projects awaited with this program, I wanted to broaden my perspective by taking on a different role each time.

Our project goal was simple but challenging: extract keywords from news headlines or Youtube new title, visualize them in a clickable Word Cloud, and connect each keyword to related news articles or videos.

---

### The Core Challenge: Communication and Trade-Offs

The hardest part wasn’t the technology — it was **communication**.

We had intense debates about:

1. Data Processing Ownership: Should the backend or frontend handle data transformation for the Word Cloud?

2. Historical Data Storage: Should we delete old data or store it for retrieval later?

The first debate was particularly heated. Traditionally, Word Clouds are static images, so preprocessing on the backend is efficient. But our version was dynamic (each keyword was clickable, meaning the data needed to be flexible and filtered client-side.)

Initially, I agreed that backend-first made sense. But when one teammate argued for frontend-side refinement to improve interactivity, I found that reasoning persuasive.

Then a backend developer said, “I’ve already written the code for this. Since the frontend is just for styling, why should it handle data processing?” I backed off, agreeing to let the backend handle it. But I didn’t feel good about the exchange.

That moment taught me something crucial: I need to express my stance clearly and unemotionally. Instead of saying, “Please handle it for now” I should have said:

| “If the clickable feature is confirmed, I believe it’s more efficient for the frontend to handle this. Can I test it today and get back to you? Otherwise, backend processing makes sense.”

That phrasing would’ve shown respect for the backend’s work while still asserting my technical perspective. I learned that clarity and tone can coexist.

---

### The Real Issue: Self-Censorship in Collaboration
Throughout the project, I realized that **“doing my part well” is not enough in a team.**

When we debated whether to store or delete old data, I stayed silent — not because I didn’t care, but because I didn’t fully understand the constraints faced by other members. I was afraid to ask what I didn’t know.

It wasn’t a lack of curiosity, but a fear of looking incompetent. That fear silenced me more than any technical barrier.

The same happened during API discussions. As the frontend developer, I should have clearly defined the data format I needed. But I hesitated, worrying I might seem demanding if I later requested refinements. I tried to finalize everything in one shot what an impossible goal for a first project.

What I learned is simple but essential:

| It’s not wrong to not know something. It’s wrong to hide it while pretending you do.

That realization changed how I view collaboration. I must quickly **voice uncertainty, ask for help, and implement feedback** — not overthink how others might judge me.

My instructor’s advice echoed in my head:

| “Don’t compare yourself to others. Differences only reflect the time each person has invested.”

Given my non-CS background and lack of team project experience, it’s natural to have gaps. What matters is how fast I bridge them by speaking up, not by silently grinding.

---

### Redefining My Goal

Before this project, I thought I wanted to become “someone who codes well.”
Now I want to become **“someone people want to work with.”**

In our next project, I’ll begin not by diving into code, but by collaboratively designing the overall flow with the team **ensuring we all start on the same page.**

Finally, I want to sincerely thank my teammates for their guidance and patience throughout my very first team project.

---

### Final Reflection

| Technical skills build products. **Honest communication builds teams.**