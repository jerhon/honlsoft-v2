---
date: "2022-10-21"
title: "Demystifying GIT: Merge Commits as GIT Objects"
tags: ["GIT"]
type: "blog"
description: "In this post I look at merge commits and what they look like in GIT's object store."
---

Up to this point, we've covered the internal object structure of GIT and the basics of how branches work and how GIT internally tracks branches.
I wanted to highlight merging specifically to show how commit objects change based on the different merge types.

## Merging in GIT

Merging in GIT is the act of combining two or more commits together.
There are a few common ways this happens.
The fast-forward merge, a traditional merge, and a squash merge.

## Fast Forward Merge

[In my previous post](2022-10-13-branching-in-git), I had already created a git repository with a few of branches.
Let's look at the current state of my repository.

```
> git log main second-branch third-branch --oneline --graph
* ab402a6 (HEAD -> main) Commit #5
  | * fe4b72a (second-branch) Commit #4
  |/
* 9e2f0e9 Commit #3
* 7f12354 (third-branch) Commit #2
* f1f10db Commit #1
```

I'm going to integrate the changes from `second-branch` into `third-branch` to catch `third-branch` up to `second-branch`.
Let's do this on the command line.


```
> git checkout third-branch
> git merge second-branch
Updating 7f12354..fe4b72a
Fast-forward
 commit3.txt | 1 +
 commit4.txt | 1 +
 2 files changed, 2 insertions(+)
 create mode 100644 commit3.txt
 create mode 100644 commit4.txt
```

Notice that it said "Fast-forward".
This is what the history of our branches looks like.

```
> git log main second-branch third-branch --oneline --graph
* ab402a6 (main) Commit #5
| * fe4b72a (HEAD -> third-branch, second-branch) Commit #4
|/
* 9e2f0e9 Commit #3
* 7f12354 Commit #2
* f1f10db Commit #1
```

Git performed the merge, and the only thing it did was move the `third-branch` pointer to `second-branch`.
Git saw the commit history:

```
Commit #4 -> Commit #3 --> Commit #2 --> Commit #1
```

It evaluated `second-branch` and `third-branch` and determined that `third branch` was pointing at `Commit #2` which is an ancestor in the linked list of `second-branch` or `Commit #4`.
This means there aren't any changes in `third-branch` that aren't already in `second-branch`.
Since branches in GIT are just pointers, GIT was able to point `third-branch` to `Commit #5`.
It also had to update the files in our local directory to match `Commit #5`.

So, really this changed nothing about the commit history.
A branch pointer was just moved.

## Traditional Merge

Let's take a look at a situation with a more traditional merge, and merge `third-branch` int `main` and analyze what the GIT object looks like for a merge commit.

```
> git checkout main
Switched to branch 'main'
> git merge third-branch
Merge made by the 'ort' strategy.
 commit4.txt | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 commit4.txt
```

Now, let's look at the history.

```
> git log --oneline --graph
*   d0ee0ef (HEAD -> main) Merge branch 'third-branch'
|\
| * fe4b72a (third-branch, second-branch) Commit #4
* | ab402a6 Commit #5
|/
* 9e2f0e9 Commit #3
* 7f12354 Commit #2
* f1f10db Commit #1
```

In this instance, GIT created a new commit, but this commit is different from previous commits we've looked at.
I have been referring as references for the GIT commits as a linked list.
That is not entirely true.
The GIT commits can have more than one parent in cases like this with a merge.
The commit history is more like a tree structure than it is a linked list.

This is referred to as a merge commit.
There really isn't anything special about it from regular commits.
It just records all the parents of the branches that were merged in as part of the commit.

Let's see what the commit object looks like in GIT.

```
> git cat-file -p d0ee0ef
tree 8352a48c6e10b4ff2920fcc0b885a28d25ace55f
parent ab402a6fb32d7b4e9ff3906ac1c91c5202cc84ff
parent fe4b72a463c262328c6c8067d45bdb0d6f542735
author Jeremy Honl <...> 1665280134 -0500
committer Jeremy Honl <...> 1665280134 -0500

Merge branch 'third-branch'
```

Note the two parent lines, and to know it was the combination of two commits.

### Details of the Traditional Merge

In the traditional merge, GIT looks at the two commits pointed by the branches to merge.

`main` was pointing at `Commit #5` and `third-branch` was pointing at `Commit #4` also referred to as the tip of the branches.
It follows the commit history of each of those branches to find a common ancestor.
In this case it is `Commit #3`.
If it can find one, it uses those three commits to perform the merge.
If there aren't any conflicts, it can apply them and move on.
If there are conflicts, there is a process to manually resolve them.
It's more complicated than that, but those are the basics behind it.

I'm not going to go into the merge conflict process in this post, or how the merge works.
I'm really just interested in what the object structure looks like for this post.
Atlassian has excellent Git articles including [one on how to deal with merge conflicts.](https://www.atlassian.com/git/tutorials/using-branches/merge-conflicts).

## Squash Merges

There is another type of merge that is used from time to time referred to as a squash merge.
A squash merge is the similar to a merge, but rather than creating a merge commit with two parents at the end of the merge process, the merge process stops prior to committing.
Typically, a new commit is made with these changes.

A squash is used typically used to "keep the history of a branch clean" as we will see in the git log.

Let's try this out to demystify it.

Let's undo our merge to main by moving main back to `Commit #5`.
I will checkout `third-branch` and add another commit to it.
This will help demonstrate the squash.

```
> git checkout third-branch
> git branch main ab402a6 -f
> echo "Commit #6" > commit6.txt
> git add commit6.txt
> git commit -m "Commit #6"
```

Let's look at the history before we continue.

```
> git log main third-branch --oneline --graph
* 69e5a3f (HEAD -> third-branch) Commit #6
* fe4b72a (second-branch) Commit #4
| * ab402a6 (main) Commit #5
|/
* 9e2f0e9 Commit #3
* 7f12354 Commit #2
* f1f10db Commit #1
```

Let's merge `third-branch` into main with a squash.

```
> git merge third-branch --squash
Automatic merge went well; stopped before committing as requested
Squash commit -- not updating HEAD


> git status
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   commit4.txt
        new file:   commit6.txt
```

In this scenario, all the files have been merged and are staged, and I can commit them as a normal commit.

```
git commit -m "Squash merge into main from third-branch"
```

If we look at the logs, this is what they look like.

```
> git log --oneline --graph
* 97466d7 (HEAD -> main) Squash merge into main from third-branch
* ab402a6 Commit #5
* 9e2f0e9 Commit #3
* 7f12354 Commit #2
* f1f10db Commit #1
```

As opposed to the traditional merge, it looks like a commit with a single parent.

We can verify this by looking at the commit object:

```
> git cat-file -p 97466d7
tree b97258bb3543050ecea33fa5b8a36e62d7855f7f
parent ab402a6fb32d7b4e9ff3906ac1c91c5202cc84ff
author Jeremy Honl <...> 1665282809 -0500
committer Jeremy Honl <...> 1665282809 -0500

Squash merge into main from third-branch
```

The only benefit we received from the squash was aesthetics.
The history of main now looks linear as there are no commits that have more than one parent.

### Be CAREFUL!

However, much can be lost with squash merges.
Remember how a traditional merge tries to find a common ancestor.

If we look at `main` and `third-branch`, the common ancestor is still `Commit #3`.
This means if we continue development in `third-branch` and edit one of these files, it's likely going to cause a merge conflict.
Let's show that.

I'm going to check out `third-branch` modify the file `commit6.txt` and commit it.

```
> git checkout third-branch
> echo "Edited Commit #6" > "commit6.txt"
> git commit -m "Modified Commit #6"
```

And we will try another squash.

```
> git checkout main
> git merge third-branch --squash
Auto-merging commit6.txt
CONFLICT (add/add): Merge conflict in commit6.txt
Squash commit -- not updating HEAD
Automatic merge failed; fix conflicts and then commit the result.
```

GIT gave us the dreaded merge conflict, but why?
Merging `third-branch` into `main` previously and `Commit #6`, so the file `commit6.txt` should have already been there.

However, since we didn't keep the full ancestry in GIT it can only go back to `Commit #3` for the merge base.
When it works out the changes between that merge base and the tip of `main` and `third-branch`, it sees that `commit6.txt` was added in main, and `commit6.txt` was added in `third-branch` but the contents are different.
Merge conflict.

Using a traditional merge and kept both parents on the commit with a traditional merge commit the conflict would have never happened.

I won't take you through the process of this, but with traditional merges the history could have looked like this:

```
> git log main third-branch --oneline --graph
*   f41212a (HEAD -> main) Merge commit 'effe7bc'
|\
| * effe7bc (third-branch) Modified Commit #6
* | 795458b Merge commit '69e5a3f'
|\|
| * 69e5a3f Commit #6
* | d0ee0ef Merge branch 'third-branch'
|\|
| * fe4b72a (second-branch) Commit #4
* | ab402a6 Commit #5
|/
* 9e2f0e9 Commit #3
* 7f12354 Commit #2
* f1f10db Commit #1
```

Each merge from third-branch into main happened with no conflicts.
However, as you can see the commit history is not as "clean" as with the squash merge.

### When to Consider Using Squashes

The only time I consider squashes is for the final integration for a branch.
Usually when all these conditions are met

* the branch is complete and no more development will occur on it
* it is integrating with another branch
* the history is not important

## Wrapping Up

I hope you've enjoyed demystifying GIT as much as I have.
In this post we've looked at the basic merge types and how the affect branches and commits.

Helping demystify these different merge types really helps reinforce when it's appropriate to use them.
