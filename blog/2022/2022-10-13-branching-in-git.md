---
date: "2022-10-13"
title: "Demystifying GIT: Branching"
tags: ["GIT"]
type: "blog"
description: "Branching in GIT"
---

Branching in source control is crucial to building software, and understanding how branching works in GIT can make it much easier to use.
Branching is a concept in GIT that differs drastically from traditional source control providers.
[In my previous post](./2022-10-07-how-does-git-store-files), I discussed the internal structure of GIT commits.
In this post, I'm going to talk about branching and how it relates to those commits.

## Review

As we had seen in my previous post on GIT storage, a commit is a snapshot of files.
Commits link to the previous commit when a new commit is made.

In this way GIT links together the commits in a repository to form a commit history which can be viewed through the
`git log` command.

Let's see this in action.

## Looking at the Commit Log

Let's create a repository and add two commits to it.

```
> mkdir git-branching
> cd git-branching
> git init

> echo "Commit #1" > "commit1.txt"
> git add commit1.txt
> git commit -m "Commit #1"

> echo "Commit #2" > "commit2.txt"
> git add commit2.txt
> git commit -m "Commit #2"
```

We can see the history of what we've done via the `git log --oneline` command

```
> git log --oneline
7f12354 (HEAD -> main) Commit #2
f1f10db Commit #1
```

From the previous post I had made, we had seen that when basing commits off each other, the commit object stored in the GIT database provide a link back to the previous commit.
The log command is using that relationship to go back and visit previous commits our current commit in the repository is based off of.
This is the commit history.
If we add another commit, we'll see it show up in the log.

```
> echo "Commit #3" > "commit3.txt"
> git add commit3.txt
> git commit -m "Commit #3"

> git log --oneline
9e2f0e9 (HEAD -> main) Commit #3
7f12354 Commit #2
f1f10db Commit #1
```

These are pretty basic operations.
If you've been using GIT for even a short while, you'll likely have seen the GIT log.
As more changes are made the log will continue to grow.

## Branching

There comes a point when it's time to work on multiple things in software and there is a need to keep that work separate to avoid unnecessary coupling.
In version control systems, branching is typically used for this.

GIT is very different in how it handles branching.
In many source control systems, a branch is a separately managed version of the code.
In GIT, branches are nothing more than a pointer to a commit.
This makes them extremely lightweight.

As branching is core to the development workflow, this is perhaps one of the most important concepts to understand with GIT.

So, let's look back at my previous example.
In the log(s) there was a section that stated HEAD -> main
Well these are indications of what commits the branches are currently pointing at.

main is the default branch in our GIT repository.
HEAD is a special pointer to what is currently being worked on in the branch.

With the second commit, GIT took the `main` branch and pointed it at the new commit we had made.
`main` no longer references the first commit, it now references the new commit.

In the `.git/refs/heads` folder, there is a single file for the `main` branch.
This is a file we can open up and look at to determine what exactly a branch is in Git.
Inside we'll see a single hash pointing to our last commit.
The contents look like this.

```
9e2f0e98f06f0cc7d7a48f7888b934999b778bf0
```

So, that's it.
A git branch is a single file with a commit hash in it.
It was pretty un-believable the first time I saw this.

## Creating a Second Branch

In order to create a branch, we'll use a command which will create the branch and check it out.

```
git checkout -b second-branch
```

Checking out the branch means it will be the branch we are currently working on.
GIT looks up the commit for the second branch and updates files inline to match it.
However, in this case, GIT really has no work to do to update the current files since this is a new branch
Creating a new branch is as simple as creating the file with `.git/refs/head/second-branch` pointing at the current commit.

Let's look at what the log looks like now.

```
> git log --oneline
9e2f0e9 (HEAD -> second-branch, main) Commit #3
7f12354 Commit #2
f1f10db Commit #1
```

The commit history has not changed, and there are two branches pointing at the same commit: `main` and `second-branch`

Git tracks the current commit with the `HEAD` pointer.
It's a special concept, and has its own file in `.git/HEAD`.
In this case we checked out `second-branch` and so `.git/HEAD` will now point at that branch.

This is important as the `git commit` command will use the head to know what the current branch is.
Let's demonstrate this with another commit.

```
> echo "Commit #4" > "commit4.txt"
> git add commit4.txt
> git commit -m "Commit #4"

> git log --oneline
fe4b72a (HEAD -> second-branch) Commit #4
9e2f0e9 (main) Commit #3
7f12354 Commit #2
f1f10db Commit #1

```

The commit command created a new commit as we had seen in the past.
Since `HEAD` pointed at `second-branch`, it updated the branch to now point at the new `Commit #4`.

If we want to go back to main and start making changes there again, simply checkout the branch.

```
> git checkout main
Switched to branch 'main'
> git log --oneline
9e2f0e9 (HEAD -> main) Commit #3
7f12354 Commit #2
f1f10db Commit #1
```

We didn't lose commit #4.
We just asked log to look at the commit log for our current branch.
Remembering that commits are essentially a linked list, log started with HEAD and worked through the commit log until it found a commit with no parent.

To look at the history of multiple branches we can include them in the log command.

```
> git log HEAD second-branch --oneline
fe4b72a (second-branch) Commit #4
9e2f0e9 (HEAD -> main) Commit #3
7f12354 Commit #2
f1f10db Commit #1
```

Let's commit something to main to see what happens.

```
> echo "Commit #5" > "commit5.txt"
> git add commit5.txt
> git commit -m "Commit #5"

> git log --oneline
ab402a6 (HEAD -> main) Commit #5
9e2f0e9 Commit #3
7f12354 Commit #2
f1f10db Commit #1
```

Let's look at the history with both branches.
In this situation, we're going to use the `--graph` option on `git log` to give us a better idea of the relationship between the commits.

```
> git log main second-branch --oneline --graph
* ab402a6 (HEAD -> main) Commit #5
  | * fe4b72a (second-branch) Commit #4
  |/
* 9e2f0e9 Commit #3
* 7f12354 Commit #2
* f1f10db Commit #1
```

GIT draws a graph to the side.
Both second-branch and main have a commit and both of those commits point back to `Commit #3`.
The branches have diverged, and I can work on separate changes in the GIT repository by switching back and forth between them with `git checkout`

Thinking back to the GIT files from my previous post, there is now a commit at `Commit #4` that points to `Commit #3`.
There is also a commit `Commit #5` and points back at `Commit #3`.

There are two branches, one that points at `Commit #5` and one that points at `Commit #3`.
The history of the commits really have no bearing on the branches.

### Let's Create a Branch from a Previous Commit

Since a branch is just a pointer, one great thing that can be done, a branch can be started from any point in the past.

```
git branch third-branch 7f12354

> git log main second-branch third-branch --oneline --graph
* ab402a6 (HEAD -> main) Commit #5
| * fe4b72a (second-branch) Commit #4
|/
* 9e2f0e9 Commit #3
* 7f12354 (third-branch) Commit #2
* f1f10db Commit #1
```

I could now checkout `third-branch` and start working on it the same way I had with the other branches in this post.

## Wrapping Up

While it's easy to pick up GIT and start using it in a similar way to other source control systems, it really is very different.
Understanding how branching works and that it is nothing more than a pointer to a commit is a very key concept to understand GIT branching.

I hope this helps inform how GIT is different when it comes to branching.
