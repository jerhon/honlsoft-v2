---
date: "2023-03-26"
title: "GIT: Branching Strategies"
tags: ["GIT", "Branching"]
type: "blog"
description: "A quick reflection on a number of different branching strategies in GIT."
---

Branching is usually a pretty simple topic in GIT.
Last year on my blog I wrote several posts on GIT.
This year I decided I wanted to expand and reflect on lessons I've learned on the process and architecture side of software development than just simple how-tos.

I've had to go through this process so many times of asking, "What branching strategy should I use for this project?"
Writing them down on a blog post would help organize my thoughts.

There are several great branching strategies out there that handle common scenarios for organizations.
I'm going to highlight a few of the main strategies I've used in the past that have worked out well for me and a few that are popular.

Now, for any given branching strategy you can find posts of people who dislike it or don't use it.
However, I'm more pragmatic in my approach.
This is really just a story of what I've used in the past and an index of what's out there.

There are several great branching models out there, as I urge teams when embarking on a new project or moving to GIT, rely on the experience of those who have been there before.
GIT is a very powerful tool with many capabilities.
Using them appropriately based on experience is crucial to have a healthy development workflow.

# What is Branching

Branching is really about isolating changes until they are ready to be integrated with other changes.
In [previous post on branching](../2022/2022-10-13-branching-in-git.md), I discussed how GIT branching is super lightweight and so branches can be used for even the smallest changes.

Branching is really powerful, but has the downside of increasing difficulty of integrating with the rest of the code base if the branch is long-lived.
Managing it effectively is key to keeping software teams running effectively.
The rest of this post focuses on a few of these key branching strategies.

## Feature Branching and GitHub Flow

A common pattern will be to create a branch for an issue or task and commit all the changes needed for that task.
Once the task is done, and a code review is performed, perhaps some automated testing is run on the individual branch.
Once it has completed quality gates, it is merged into another branch with other developers changes.

It works very well for small projects and small repositories.
In general, I use this strategy unless I need a more stringent release practices.

This pattern is often built off of to build more complex branching strategies like GitFlow and Trunk-based development.
Or - you can find this branching strategy hidden inside.

[Atlassian has a great resource describing feature branching and some other branching strategies.](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow)

This works extremely well when an organization is able to have ephemeral environments and especially during container development.
If an environment can be stood up for a branch very quickly, each branch can be tested individually either automatically or manually.
There is a branching model that is very similar to Feature Branching named [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow).
This is similar but releases changes directly from the feature branch.

I've had a lot of success using just feature branching for small projects with a few developers.
It's really straight forward and easy to collaborate without having any big merge messes in the future.

## GitFlow Branching

GitFlow is a strategy for dealing with complex versioning requirements in software systems.
It allows for dealing with complex intricacies of developing software and determining releases.

It involves several branches with a release branch and a main branch for the current code in production.

Developers work in a development branch, and when they are ready to release the code is branched off to a release branch.
The release branch is used to build the artifacts.
Testing is done on the release branch until it is determined to be stable.
Once that is done, the build artifact from that branch that was determined to be stable is moved to the higher environment.

Developers can start development on the next release without impacting the release branch.

In order to be able to release changes at times outside the main release cycle, the strategy includes hotfix branches.
The hotfix branches are for changes that fall outside the normal release cycles.

[Here is the main GitFlow documentation.](https://datasift.github.io/gitflow/IntroducingGitFlow.html)

GitFlow can work great in organizations with a release cadence or defined releases.
I've used this branching strategy for a few projects.
It works well at what it sets out to accomplish, but can be a bit heavy-handed for smaller projects.
GitFlow has a small twist in that releases are conducted from the feature branches.

## Trunk Based Development

[Trunk based development](https://trunkbaseddevelopment.com/) is a bit of a mix of Feature branching and GitFlow.

It utilizes feature branching, but at a certain point it's decided to release the work that has gone on in the trunk
At that point, a release branch is made to stabilize the branch until it's ready to release.

This relies on several techniques to avoid long living branches.
One example is branch by abstraction.
If new functionality is to be introduced, the old functionality is abstracted first.
After the abstraction has been created, a second implementation is made.
Work continues on that second implementation in small increments until it is complete.
Once it is complete, the second implementation is swapped for the first.

Trunk based development is another great strategy for developers.
I have lightly used this strategy with feature branching on projects.

## Environment Based Branching

This is a strategy that ties a deployment model with a source control system.
For each environment, a branch is created.
An example would be a branch for Dev, Test, Stage, and Production.

Honestly, I hesitate to even write about this as it ends up becoming an enormous time sink for the development team.
However, in organizations that develop internal software, this is an extremely common suggestion.

Every time a change is made from one environment to the next, it must be integrated with the next branch in the chain.
I'm in development I have a change, I move it to test, followed by, stage, followed by production.
Typically, GIT uses merges to integrate branches together. 

However, in reality the business wants to release functionality more often than the branches can get to a stable state.
Developers will keep checking into Development with no clear check-point in the future when the branch is stable and can be completely merged to test.
However, since we just have a development branch, typically at no point is a lower branch such as Dev ready to be merged to Test.
Since the changes cannot be merged, often will fall back to strategies such as cherry-picking or rebasing to move their changes from one environment to another.

This is one of those things, it sounds great in theory, and GIT has some very powerful tools at its disposal that can enable this, but in practice it falls apart pretty fast.

### Why

This branching model gives a lot of flexibility to move changes from environment to environment.
In certain situations, it can be useful.
In cases like GitOps or where environment configuration is stored in source control.

So, this model is really better suited in cases in situations dealing with deployments.

The other reason this branching model is so popular is because of it's perceived flexibility.
When resorting to rebasing or cherry-picking, individual work items can be approved and moved from one environment to another at any given moment.

### Why Not

There are so many downsides to this branching model for an organization that lead to some very nasty side effects.
Again, I hesitate so much at even writing a blog post about this branching strategy as I don't want someone to read this and say, LET'S DO IT.
However, I've seen it several times throughout my career now and just can't help but mention it.

#### Increased Dependency Management

One of the inherent difficulties of this model is that of pulling apart changes.
Source control does a good job of creating the facilities to integrate changes into a branch.
However, when it comes to taking an individual change moving it out of the branch and applying it to another it becomes very difficult.

This is really due to the dependencies a work item incurs when it is integrated into a branch.
For example, when I check into the Dev branch, my work can potentially be dependent on any work prior to mine.

The natural tendency is to want to deploy my change as soon as it is ready.
This leads to the unfortunate situation where other work in the Dev branch may be ready, but mine is not or vice versa.
My work may be dependent on those.

With this branching strategy, this is an incredibly hard problem to solve especially in very large repositories such as mono-repos with larger development teams.
It's not easy to determine what depends on what without a lot of coordination, and often time people won't even know what others are working on until they go through the process of merging in their changes.
This is all the more true when techniques such as rebasing and chery-picking are used to integrate changes.

This leads to a huge amount of manual effort.

#### Increased Project Management Cost

The state of every change must be tracked with precision.
Since changes are managed individually or on a smaller scale, and by in large cherry-picking and rebase create new commits.
Thus creating a relationship back to the work item is tricky and knowing what has been committed to which environment is difficult.

In most branching models, a developer integrates into a branch through a merge.
When that is done a work item is tracked on what they commit in source control via tags and the work item.
This can automatically flow through most modern tracking systems today as code moves from branch to branch.
As code is merged, eventually it makes it to a branch for a release at which point all the links in the system resolve.

However, in an Environment based branching model it is nearly impossible to determine what has been applied where.
The commits end up being duplicated due to the use of rebase or cherry-pick.
When they do diverge it becomes difficult to reconcile.

#### Increased QA Cost

This leads to an increase in cost required to merge the code and cost to test the code.
Since there are different build artifacts per environment and potentially different code bases QA efforts often end up needing to be duplicated.
The manual effort to move the changes from one branch to another lead to problems where a change is made in one environment but not another.

This may not be as big of an issue for businesses that have embraced automation.
However, if a business is running manual tests, the amount of testing that needs to be done is much more.

Often things will be found in one environment that never occurred in another.
Maintaining a consistent environments is difficult in and of itself unless an organization embraces automation.
This just adds another place where problems can occur.

#### Increased Development Cost and Anti-Agile

Since every change requires effort to move from branch to branch individually as the development organization scales up the amount of work to manage the release increases dramatically.
As more developers come into the organization, the amount of work to move commits from environment to environment and increases as it is directly proportion to the number of developers.

This stands in direct odds with Agile practices where developers are asked to break work into smaller pieces.
The smaller the work becomes, the more work it becomes to move the work from environment to environment.

This tends to lead to a drive to attempt to release less often due to the inherent work in the branching model.
A team or group of individuals is tasked with the work of moving code around.
It consumes a majority of their time.
The organization either ends up needing to scale up it's team of individuals dedicated to moving code as it hires developers, or reducing its number of releases.

## Wrapping Up

I've seen many branching strategies that fit different organizations and projects.
Hopefully this gives a good index of those branching strategies to consider.

I've had to go through the process so many times of asking, "What branching strategy should I use for this project?"
Writing them down on a blog post would help organize my thoughts.

However, the one thing I can never stress enough to teams thinking about using GIT as their source control system is don't roll your own branching strategy.

Be agile.
Focus on your customer.

There are plenty of good branching strategies out there. 
It should be possible to find one that fits your project and organization.
