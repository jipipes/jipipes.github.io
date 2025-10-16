---
layout: page
title: Tags
icon: fas fa-tags
order: 4
---

<div id="tags" class="d-flex flex-wrap mx-xl-2">
  {% assign tags = '' | split: '' %}
  {% for t in site.tags %}
    {% assign tags = tags | push: t[0] %}
  {% endfor %}

  {% assign sorted_tags = tags | sort_natural %}

  {% for t in sorted_tags %}
    <div>
      <a class="tag" href="/tags/{{ t | slugify | url_encode }}/">
        {{ t -}}
        <span class="text-muted">{{ site.tags[t].size }}</span>
      </a>
    </div>
  {% endfor %}
</div>
