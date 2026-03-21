---
date: "2026-03-19"
title: "Parallelizing Chess Engine Work with GitHub Copilot CLI"
description: "I had the day off for spring break to spend time with family, but everyone was still asleep and I had a quiet block of time in the morning. Instead of scrolling, I decided to use that time to level up my AI workflow. Over the last few weeks, GitHub Copilot has shifted for me from a tool that answers questions and occasionally completes code to something closer to an entry-level co-contributor."
tags: ["GitHub Copilot", "AI", "CLI", "Go", "Developer Productivity"]
type: "blog"
---
I had the day off for spring break to spend time with family, but everyone was still asleep and I had a quiet block of time in the morning.
Instead of scrolling, I decided to use that time to level up my AI workflow.

Over the last few weeks, GitHub Copilot has shifted for me from a tool that answers questions and occasionally completes code to something closer to an entry-level co-contributor.

A few years ago, I started learning Go and began building a basic chess engine.
I still revisit the project, but only in short bursts.
Because I rarely get long uninterrupted blocks of time, it remains unfinished.

As development shifts towards AI, I've been looking at finding ways to use GitHub Copilot itself to help me make progress on the chess engine.

## The Chess Project

The repository is a hobby chess engine in Go.
Like most side projects, it has a mix of:

- known bugs,
- missing features,
- rough edges that were never prioritized,
- and TODOs that I plan to come back to

Normally, I would open one issue, fix it myself, then move to the next.
Or just fix the issue without opening one at all.
That works, but it scales linearly with my available time.

Today I tried something different.

## My Workflow

I asked Copilot to review the repo and identify bugs or missing features.
Then I asked it to write each finding into a `FIXES.md` file.

After that, I had it open a GitHub issue for each item.
Finally, using GitHub Copilot CLI, I asked it to assign an AI agent to each issue.

At a high level, the workflow looked like this:

1. Scan repository for likely bugs and feature gaps.
2. Produce a structured findings list in `FIXES.md`.
3. Convert findings into GitHub issues.
4. Dispatch an AI agent per issue.
5. Wait for each agent to return a pull request.

The key change is that work fan-outs into parallel streams instead of serially waiting on me to complete each task.

## Fan-out with AI Agents

In the time it would normally take me to fix a single issue, I had multiple agents working at once on independent tasks.

Each issue is expected to produce a pull request artifact, which is the part I care about most.
The PR gives me:

- a concrete diff I can review,
- a place to ask follow-up prompts,
- and an easy way to reject a bad solution.

That makes the experiment safer.
I am not giving up control of the repository.
I am accelerating the draft implementation phase and keeping human review as the gate.

## Using Pull Requests as the Boundary

Having pull requests as the output keeps the process grounded.

If a solution is wrong:

- I can comment and iterate.

If it is partially right:

- I can merge parts or request targeted adjustments.

If it misses the mark entirely:

- I can close it and move on without polluting the main branch.

That boundary lets me experiment aggressively without feeling locked into any single generated result.

There are downsides however.
This does shift the work from implementation to review.
I now effectively have a team of AI agents whose output I need to review and curate.

## Wrapping up

For side projects, momentum is often the hardest part.
This workflow helped me create momentum from a single quiet morning.

I did not finish the chess engine today.
But I converted one short time window into a queue of concrete, reviewable changes.

That is a meaningful shift in how I think about shipping personal projects:
less "find time to do everything myself," and more "set up a system that can make progress in parallel while I stay in control."
