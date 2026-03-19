---
name: blog-post-authoring
description: "Write a new Honlsoft blog post in this Gatsby repository. Use when asked to draft or create blog posts, generate frontmatter, choose tags, structure technical writeups, or place a post in blog/YYYY with the correct filename format."
---

# Blog Post Authoring Skill (Honlsoft)

Use this skill to create new technical blog posts that match the structure and conventions used in this repository.

## Goal

Produce a publish-ready Markdown post that:
- follows this repo's file and frontmatter conventions,
- matches the established Honlsoft writing style,
- includes practical technical content and examples,
- avoids fabricated claims.

## Repository Conventions (Required)

### File location and naming

Create new blog posts in:
- `blog/YYYY/`

Use this filename pattern:
- `YYYY-MM-DD-kebab-case-title.md`

Examples:
- `blog/2026/2026-03-19-my-topic.md`
- `blog/2025/2025-04-19-building-a-pig-latin-translating-chat-bot.md`

### Required frontmatter

Minimum required fields:

```yaml
---
date: "YYYY-MM-DD"
title: "Clear Post Title"
tags: ["Tag1", "Tag2"]
type: "blog"
description: "One-sentence summary of what the reader will learn."
---
```

Optional fields:
- `template: "scientific"` only when an academic/scientific style is explicitly requested.
- `project: ["..."]` when intentionally linking to project-related post grouping.
- `image:` when adding a preview/share image.

Do not set `page:` for normal blog posts.

## Writing Style to Match Existing Posts

Mirror the style in `blog/`:
- first-person, practical, developer-to-developer tone,
- concise sections with `##` headings,
- short motivation context up front,
- explain briefly, then show implementation,
- include runnable/realistic snippets when useful,
- close with a short wrap-up.

Avoid:
- generic marketing tone,
- long abstract theory without examples,
- unsupported performance/version claims.

## Recommended Post Shape

Use this default flow unless the user asks otherwise:
1. Why this topic matters
2. Setup/prerequisites
3. Implementation steps
4. Example outputs/verification
5. Pitfalls and improvements
6. Wrap-up
7. References (when external sources were used)

## Source and Accuracy Rules

When reference URLs are provided:
- read sources before making factual claims,
- paraphrase instead of long quoting,
- do not invent missing details,
- if a source is unavailable, continue and state the gap.

If no sources are provided:
- rely on broadly stable knowledge,
- avoid narrow version-specific claims unless confidence is high,
- clearly state assumptions when uncertain.

## Tag and Title Guidance

Title:
- specific and action-oriented,
- reflect the concrete technology/task.

Tags:
- 2 to 5 technical tags,
- keep capitalization and wording consistent with existing posts.

Good examples from this repo include tags like:
- `"AI"`, `"Python"`, `"LangChain"`, `"Gatsby"`, `"Web Development"`, `"GitHub Copilot"`, `"VS Code"`.

## Length Guidance

Default target length:
- 700 to 1400 words.

Use shorter drafts only when the user asks for a quick post.

## Steps to Execute

1. Determine publication date (`YYYY-MM-DD`) and year folder.
2. Generate kebab-case slug from title.
3. Create file in `blog/YYYY/YYYY-MM-DD-slug.md`.
4. Add valid frontmatter.
5. Write article body with `##` section headings and concrete examples.
6. Add `## References` if external links were used.
7. Perform a final consistency check.

## Final Quality Checklist

- File path and filename follow the repo pattern.
- Frontmatter includes `date`, `title`, `tags`, `type`, and `description`.
- `type` is exactly `"blog"`.
- Content is practical and technically coherent.
- No fabricated facts, benchmarks, or version claims.
- `template: "scientific"` only if explicitly requested.

## Asset

Use the companion template file in this skill:
- `BLOG_POST_TEMPLATE.md`
