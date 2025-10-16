---
layout: post
title: "Mastering the API Contract: From Frontend Confusion to Collaborative Specification"
categories:
    - Bootcamp
date: 2025-10-07
description: "A reflection on learning to design and negotiate an API specification — from frontend confusion to true collaboration with backend developers."
---

### Initial Research: Defining the API Contract

As this was my first time creating an API specification from a frontend perspective, I started by researching how it's handled in real-world projects. I found that:
<br>
<details>
    <summary>Basic concept of API Specification</summary>
    <p>: a guide that defines how features should be requested and responded to, typically drafted after the initial planning and UI/UX stages.</p>
    <p>There is no single set of rigid rules; documentation methods vary widely, from simple emails to detailed Excel files. The key is for the specific team or organization to establish clear design principles.</p>
    <p>Fundamentally, an API is composed of a <strong>Method + Endpoint</strong>.</p>
</details>

<br>
I learned that the following principles are crucial for effective design:

- Endpoints should be used as **nouns**.
- The path should move from a broader resource to a more specific one.
- Avoid using file extensions.
- Use dashes (-) instead of spaces.
- One URL should generally correspond to one resource.

<details>
    <summary>What is an Endpoint?</summary>
    <p>A dictionary definition is: "An Endpoint is one end of a communication channel."</p>
    <p>on a domain like <code>www.reddit.com</code>, the full request path looks like this:</p>
    <pre><code>DOMAIN: www.redit.com
METHODS: GET
ENDPOINT: /posts(resource)/1212121212(parameter)?contents=season_4_photo(query_string)</code></pre>
    <p>The Method refers to an HTTP verb (GET, PUT, POST, DELETE), and the Resource refers to the domain's resource. Therefore, the Endpoint consists of the resource, parameter, and query string.</p>
</details>

---

### The Flawed Process and the Ideal Realization

Initially, my approach to creating the specification was linear: I organized the feature requirements, roughly mapped out where data should flow, and then—after all my solitary research and learning—I created the API specification alone and submitted it to the backend developer for feedback.

This process, which began with mapping out the UI/UX on Figma to understand the user flow, led to a critical realization: my solo work was fundamentally flawed.

I realized that a much better process for future projects should be:

1. **Collaborative Planning:** Define feature requirements **together with all team members** during the planning stage.
2. **Joint Data Scoping:** Discuss, as a team, what data should be included in the requests and responses based on the agreed-upon features.
3. **FE-Driven Response Specification:** The frontend should clearly state **how they need the data field in the response to look**, and then adjust the direction in consultation with the backend team.

I am committed to following this collaborative process in every project I handle, regardless of my role. I realized that the issue of teammates not being on the **"same page"** was a recurring problem. This requires continuous adjustment through meetings.

My confusion about the overall project picture stemmed from the fact that our team never properly documented feature specifications. I was left to scour meeting minutes and backlog materials alone to piece together the requirements. I now know this was a huge mistake, and I am determined to request a meeting whenever a critical specification is unclear.

---

###  The API Response Format Debate

The API specification I created for the project looked like this:

| **Feature** | **Description** | **Method** | **Endpoint** | **Parameters** | **Response Example** | **Notes** |
|--------------|-----------------|-------------|---------------|----------------|----------------------|-----------|
| **Get All Word Cloud** | Generates a word cloud based on all news headlines when the user accesses the service. | `GET` | `/api/wordcloud` | - | <details><summary>View</summary> <br> <pre><code class="language-json">Success (200 OK): {<br>  "success": true,<br>  "data": [<br>    { "word": "Economy", "count": 27 },<br>    { "word": "Politics", "count": 8 }<br>  ]<br>}</code></pre> </details> | **[Common Error Responses]**<br>400: Bad Request (Invalid parameters)<br>404: Resource Not Found (No data available)<br>500: Internal Server Error |
| **Get Word Cloud by Category** | Generates a filtered word cloud based on selected media outlet(s) and date range. | `GET` | `/api/wordcloud` | `press` (string): Media filter (KBS, SBS, MBC, JTBC)<br>`date` (string): Date range (`weekly`, `daily`) — internally mapped to `start_date` and `end_date` | <details><summary>View</summary> <br> <pre><code class="language-json">Success (200 OK): {<br>  "success": true,<br>  "data": [<br>    { "word": "Interest Rate", "count": 19 },<br>    { "word": "Exchange Rate", "count": 12 },<br>    { "word": "Government", "count": 10 }<br>  ]<br>}</code></pre> </details> |  |
| **Get News List by Keyword** | Returns a list of related news articles when a keyword is clicked in the word cloud. | `GET` | `/api/news` | `keyword` (string): The selected keyword | <details><summary>View</summary> <br> <pre><code class="language-json">Success (200 OK): {<br>  "success": true,<br>  "data": [<br>    {<br>      "title": "Interest Rate Hike Shocks the Market",<br>      "url": "https://news.example.com/article/123",<br>      "press": "KBS",<br>      "date": "2025-10-02"<br>    },<br>    {<br>      "title": "Bank of Korea Maintains Base Rate",<br>      "url": "https://news.example.com/article/456",<br>      "press": "SBS",<br>      "date": "2025-10-01"<br>    }<br>  ]<br>}</code></pre> </details> |  |
| **Search News Articles** | Retrieves news articles related to the given search query. | `GET` | `/api/news` | `q` (string): Search keyword | <details><summary>View</summary> <br> <pre><code class="language-json">Success (200 OK): {<br>  "success": true,<br>  "data": [<br>    {<br>      "title": "Exchange Rate Surpasses 1,400 KRW",<br>      "url": "https://news.example.com/article/789",<br>      "press": "MBC",<br>      "date": "2025-10-03"<br>    },<br>    {<br>      "title": "Government Announces Forex Stabilization Measures",<br>      "url": "https://news.example.com/article/999",<br>      "press": "JTBC",<br>      "date": "2025-10-02"<br>    }<br>  ]<br>}</code></pre> </details> |  |

I presented it to the backend developer. They provided feedback, noting a crucial need for consistency in the response format.
I had initially proposed a structure based on: `success: true/false + data or error.message`
However, the backend functions were utilizing a format like: `JsonResponse({'status': 'error', 'message': '...'}, status=500)`
I decided not to simply conform to the backend's existing design. I requested a discussion to compare the pros and cons of both structures, explaining my reasons for favoring mine.

| **Response Structure** | **Pros** | **Cons** |
|--------------------------|-----------|-----------|
| **My Way** (`success: true/false`) | **Intuitive and FE-Friendly:** Clients can immediately branch logic with `if (response.success)`. Excellent structural consistency — data on success, error object on failure. | Grouping all errors under `success=false` makes it harder to segment error types without checking a separate code. |
| **Backend Way** (`status: string`) | **RESTful Alignment:** Better aligns with HTTP status codes and RESTful principles. Logging and debugging are easier as internal status matches server logs. | Less intuitive for the FE (requires an extra string comparison). Higher risk of typos in custom status strings. |

I argued that the short deadline and the need to avoid the overhead of **string-checking** in the frontend code made my method more time-efficient. Additionally, asking the backend team to specify and implement a detailed `status` enum would take up valuable time, especially during a holiday period.

After hearing my reasoning, the backend developer agreed to adjust the response to match the structure I had specified.

---

### The Ultimate Lesson: Negotiation and Value

I felt proud that I was able to state my case, support it with comparative analysis, and negotiate a successful outcome while respecting my teammate’s constraints.

I realized that regardless of the company or project, **"limited time and resources"** will always exist. The ability to analyze options based on these constraints, justify my choice, and successfully advocate for the most efficient solution will be a vital skill moving forward. My goal has officially shifted from **"a good coder"** to **"a highly collaborative and efficient team member."**