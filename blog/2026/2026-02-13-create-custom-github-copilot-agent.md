---
date: "2026-02-13"
title: "How to Create a Custom GitHub Copilot Agent"
tags: ["GitHub Copilot", "AI", "VS Code", "Developer Tools"]
type: "blog"
description: "A practical walkthrough for creating a custom GitHub Copilot agent profile, configuring tools and prompts, and using it in day-to-day development."
---

I’ve been trying to use Copilot more for focused workflows lately, and one of the best upgrades is creating custom agents for specific tasks.
Instead of re-explaining context in every prompt, I can encode behavior once in an agent profile and reuse it.

In this article, I'll share how I created a custom Copilot agent for authoring blog post which actually helped me with the rough draft of this blog article.

While this seems a bit like cheating, I often find looking up information via GitHub copilot and grounding it with references is a great way to learn a new topic. Writing blog articles is largely the same experience.  Use experience and web references to create an article.

Was CoPilot able to write this entire article?  Of course not, but it did help me get started, and helped me iterate on it.

## Why create a custom agent and what's the difference between prompts or instructions?

The default coding agent is broad by design.
That’s great for general use, but it’s even better when you can give it specific knowledge.

Prompts effect an individual request and ask what you want an agent to do in a moment.

Instructions define rules related to files or a repository.

Agents give you the ability to encode behavior once and reuse it across sessions and tasks.

## Where the agent file lives

The agent profile is a Markdown file ending in `.agent.md`.
For repo-level agents, the standard location is:

```text
.github/agents/<agent-name>.agent.md
```

That filename matters because it becomes the default displayed agent name when `name` is not explicitly set.

Once the file is committed, the agent becomes available in the Copilot agent dropdown on GitHub.com and in supported IDEs.

## Agent profile anatomy

A custom profile contains:

- YAML frontmatter (identity + capabilities), and
- instruction body (the agent’s behavioral prompt).

You’ll usually see a few common fields in frontmatter. The `name` is the display name and is optional, while `description` is required and should clearly summarize what the agent does. You can optionally set `tools` to limit which tools the agent can use; if you leave it out, the agent can use all available tools. In IDE scenarios, you can also set `model` to pick a preferred model, and `target` if you want the agent scoped to a specific environment like `vscode` or `github-copilot`.

Here’s part of `blog-author.agent.md` example from this repository:

```chatagent
---
name: Blog Author
description: Creates technical content based on a provided topic and optional reference URLs, following the style of existing blog posts in this Gatsby site.
---

You are a Copilot blog author agent for this repository.
Your job is to write a complete blog post in the style used in `blog/` based on:
1) a provided topic, and
2) optional reference URLs supplied by the user.

# Blog Author Agent (Honlsoft)

Produce a publish-ready Markdown blog article for this Gatsby site that is:
- technically accurate,
- practical and readable,
- aligned with the existing Honlsoft writing style,
- grounded in provided references and clearly marked assumptions.
```

Iterating on the agent then allows more focused behavior, like requiring specific frontmatter fields, or instructing it to follow particular style patterns.

Creating an initial agent can be done by a prompt itself.  For example, I created the first draft of `blog-author.agent.md` by asking the default coding agent:

```
Create instructions for a copilot agent blog author based on the content in my blog articles in the "blog" folder. It will write a blog article based on a provided topic and lookup any provided URLs as reference for the blog content.
```

Of course iteration is needed beyond the first draft, but it’s a great way to get a starting point that you can then refine or use for ideas in your agent.

## Using your custom agent day-to-day

Once the profile is available, pick it from the Copilot agent dropdown and use it for the narrow task it was designed for.

Using an agent, this adds more information to my prompt which helps make a prompt more specific to the task at hand.  It avoids me having to repeat myself in a prompt.  I can tell it what my conventions are for writing blog article, and then it uses that information to create a blog article for me based on a topic and references I provide.

For example, I can ask the `Blog Author` agent:

```
Create a new blog article on how to create a custom agent GitHub copilot. Here is a reference article on how to make an agent:

https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents
```

It filed out the frontmatter for me, suggested tags for the blog article, and created a new blog file for the article with some initial content to get me started.

Did I have to edit the article after that?  Of course, but it was a helpful starting point that saved me time and helped me get past the blank page.

## Wrapping up

Custom Copilot agents are one of the easiest ways to make AI assistance feel tailored to your workflow.
You define behavior once, keep it in source control, and then reuse it across tasks.

## References

- https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents
