---
layout: post
title: "Why My GitHub Blog Wouldn't Build — and How I Fixed It"
categories:
    - Problem Solving
date: 2025-08-26
---

### TL;DR
My GitHub Pages blog wasn't building due to a Liquid syntax error in a post title. The issue was caused by special characters in the filename that Jekyll couldn't process.

### The Problem
When I tried to build my Jekyll blog locally, I encountered this error:

```
Liquid Warning: Liquid syntax error (line 83): Expected end_of_string but found open_round in "hashFiles('**/package-lock.json')" in /home/runner/work/jipipes.github.io/jipipes.github.io/_posts/2025-08-26-Why My GitHub Blog Wouldn't Build — and How I Fixed It.md
```

### Root Cause
The issue was in the filename itself: `2025-08-26-Why My GitHub Blog Wouldn't Build — and How I Fixed It.md`

The problem was the em dash (—) character in the filename. Jekyll's Liquid templating engine was trying to parse this as Liquid syntax, which caused the build to fail.

### The Solution
I renamed the file to use a standard hyphen instead of the em dash:

**Before:** `2025-08-26-Why My GitHub Blog Wouldn't Build — and How I Fixed It.md`
**After:** `2025-08-26-Why-My-GitHub-Blog-Wouldnt-Build-and-How-I-Fixed-It.md`

### Key Takeaways
1. **Avoid special characters in filenames** - Stick to alphanumeric characters, hyphens, and underscores
2. **Test locally before pushing** - Always run `bundle exec jekyll serve` locally to catch issues early
3. **Check Jekyll logs carefully** - The error messages often point to the exact file causing issues

### Prevention
- Use standard ASCII characters in filenames
- Avoid spaces, em dashes, and other special characters
- Test builds locally before pushing to GitHub Pages
- Keep filenames simple and descriptive

This was a simple fix but a good reminder to be careful with special characters in technical contexts!