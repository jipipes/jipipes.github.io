---
layout: post
title: "Why My GitHub Blog Wouldn't Build- and How I Fixed it"
categories:
    - Problem Solving
date: 2025-08-26
---

### TL;DR
- Git said everything was up-to-date. But it wasn't.
- GitHub Actions didn’t trigger — nothing deployed.
- Turns out it was a combination of image size, missing lockfile, and too many NPM requests.

---

### The Symptom
My terminal told me git commit was successful.
Running bundle exec jekyll serve showed the post locally.
But GitHub didn't reflect the commit, and no Actions were triggered.

### Step-by-step Debugging

**1. Check commit history**
>git log --oneline

My commit was there locally.
![git log](/assets/img/post-2025-08-26-0.png)

**2. Try forcing a push**
>git push origin master --force

Still didn’t work.

**3. Confirm it’s not a permission issue**
>git remote -v

HTTPS confirmed token auth was being used.
So no SSH issue — not a permission problem.

**4. Compare with remote**
>git log origin/master --oneline

Confirmed: GitHub didn’t reflect my push.

**5. Reconnect remote tracking and push**
```yaml
git branch --set-upstream-to=origin/master master
git push origin master
```

Got this error:
>error: RPC failed; HTTP 400 curl 22 ...

fatal: the remote end hung up unexpectedly
Everything up-to-date

---

### Suspecting image size

The only unusual thing: 4 large .png files (~1.2MB each).
Used [squoosh.app](https://squoosh.app/)
to compress them to ~300KB .jpg.

Still failed. So I increased Git’s buffer:
>git config --global http.postBuffer 524288000

Finally, push succeeded and Actions triggered.

---

### New Issue: GitHub Actions stuck
It hung for 20+ minutes on this step:
>Run npm i && npm run build

So I split them:
```yaml
name: Install dependencies
    run: npm ci
    
name: Build site
    run: npm run build
```

Added caching to speed things up:
```yaml
name: Cache node modules
    uses: actions/cache@v3
    with:
        path: ~/.npm
        key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
        restore-keys: |
         ${{ runner.os }}-node-
```

But got hit with a new problem:
>npm error 429: Too Many Requests

![npm error 429](/assets/img/post-2025-08-26-1.png)

Switched to auto-cache like this:
```yaml
name: Setup Node
    uses: actions/setup-node@v4
    with:
        node-version: lts/*
        cache: 'npm'
```

Now a new issue popped up:
>Dependencies lock file is not found ...

![Dependencies lock file is not found](/assets/img/post-2025-08-26-2.png)

Turns out package-lock.json was excluded via .gitignore.
I removed the exclusion, re-created the file, committed, and finally GitHub Pages built successfully. Post deployed.
![Post deploying success.](/assets/img/post-2025-08-26-3.png)

---

<details>
<summary><strong>Reflection</strong></summary>

This seemingly samll task took a full days.
<br>But I now understnad:
<br>- Git workflows & debugging push issues
<br>- How image size affects Git & CI/CD
<br>- How GitHub Actions caching and node setup works
<br>- The importance of lockfiles and workflow configuration
<br><br>
Through this long process of debugging and fixing unexpected errors, I've relized how important it is to have a solid structural understanding of what I'm working on.
<br><br>
I started this blog without much planning. Just diving in headfirst. And because of that, I encountered countless issues early on. 
<br><br>
But in solving them one by one, customizing the project with my own haands, I learned so much more than I anticipated.
<br><br>
There's still a lot I don't know, but this experience made me even more attached to this GitHub blog. I'm determined to keep building and imporoving it-both the blog and myself.

</details>