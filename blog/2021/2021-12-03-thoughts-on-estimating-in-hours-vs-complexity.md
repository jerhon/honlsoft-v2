---
date: "2021-12-03"
title: "Thoughts on Estimating in Hours vs Complexity"
tags: ["estimations", "software-process"]
type: "blog"
description: "These are some of my personal thoughts on estimating in hours vs complexity"
---

Why is estimating in hours so difficult?
I often wondered this as I sit and am required to put hours on tasks.
I had been formulating ideas on this, and these are the conclusions I've come to so far.

I've been reading some select chapters from "The Mythical Man-Month".
The book has some key conceptual ideas behind estimating that are still relevant nearly 50 years after it was published.
However being 50 years old, there are also some chapters that are very antiquated and really aren't useful.

I'm writing this post to fortify my learning.
As always, all opinions are my own.
I know there will be those who disagree with it.
In the end, use whatever method of estimations you feel works for you and your team.
Teams are different, and at the end of the day as software professionals the most important thing is to meet customer's needs.

I have worked in both environments that estimate in hours, and those that estimate in complexity.
I am also a developer and approach it from that perspective.
However, I have  had to wear many hats in my career. 
I've had to run projects both with PM help and without PM help, and have had the luxury of being part of real teams that run Scrum in the past.

# Using Units to Measure

Measurements are taken in fixed units.
Typically, something that is agreed upon.
Perhaps it's dollars and cents, or feet and inches.
Regardless of what's being measured, some pre-agreed on unit is utilized.
It would be incredibly difficult to measure a distance if the unit of measure were changing.
For example, say a foot was sometimes 13 inches and other times 11 inches.
Even though we both agreed that our estimate may be 5 feet, if we don't have a concept of what a foot is, the estimate will mean different things.

# Estimating Work

For general purpose work and tasks where the effort is well known, complexity of the task can come into play.

I worked at a window factory one summer in high school screwing hardware into windows at the end of a production line.
The task was very repetitious, and you could likely take my performance and say this is how many pieces of hardware Jeremy can put on a window.
Given X windows that require Y pieces of hardware, how long will it take Jeremy.

Behind these tasks though, there is a common thread, the work is repeatable and conceptually simple.
I will be doing the same thing over and over again, and I can learn from past trends how long that job will take.

# People and Work are Variable

People will accomplish things at different rates.
There are people that are incredibly good at what they do.
There are people that will just slide through work and not think about the consequences of it.
There are some that will treat their trade as a craft and make sure things are solid when complete.

Complex work can be different too.
When I solve a problem in software, if I'm working on a production bug it can take hours or days to track down a problem.
Problems can be a simple line of code.
However, at the same time, there are days when I can write hundreds of lines of code no problem.

Two different tasks in software development can vary widely.
It's often not the repeatable task I would have to do over and over and over again.

# Estimated Hours are not Purely Hours

When estimating tasks, time is not purely hours.
It is contextual based on who is doing the work.
However, people are variable in what they can accomplish.

I think back to my job at the window factory.
Honestly, the first few weeks, I was useless.
If someone had tried to calculate how much I had gotten done in that first week by someone who has been working there for years, they would be way off.
However, as I gained experience and through repetition, I became good at my job.

Software is the same way.
An entry level developer will have different experience than a senior level developer.
A senior level developer will have different experience than an architect.
Even based on that, who knows who will complete any given task faster.
If the entry level developer has spent months on some technology or knows an area of software very well, and the architect hasn't, the entry level developer may even be faster.

I have had software where a change to a single line can take hours.
I have had software where I can write hundreds of lines of code in a day.
I've had software where the same task can take one person months, and another person weeks or days.

Then there are all kinds of things that can be out of our control.
Is the development environment set up correctly?
Is the development environment stable?
Does the software use generally accepted best practices?
Is the software that's being created modified written with good architectural practices?
Will the IT team send out another configuration change that will adversely affect my PC?

This is only the beginning.
So, really our unit when we are estimating is not just an hour.
It is how long does it take this person to complete a task.
The unit is more along the lines of person-hours or person-months.

# The Problem

That is the crux of the problem, person-months, person-weeks, or person-hours is variable.
It is not a fixed unit, and people generally are not interchangeable.

Going back to the initial premise.
Accurate estimations requires a fixed unit.
Estimating purely in person-hours or person-months does not guarantee that accuracy.

# Estimate Based on Complexity

Complexity, comparison, and looking at the past is key to estimating.

The idea of estimating based on comparisons and complexity is relatively simple.
Given several tasks in the past, and I have a vague idea of what I'm going to do to accomplish a new task, compare the relative complexity between them.
If I know task A took 4 actual hours (that is a concrete time unit), and task C took 8 actual hours (also a concrete time unit), and task B is less complex than C, but more complex than A, I can estimate between the two and say it will take between 4 and 8 hours.
As more work is accomplished, the more tasks that can be used to reference and refine my estimate of how complex the task is.
Then I can pick up a few key tasks I've worked on in the past and use them as guides.

It doesn't work all the time, but there is no estimation method that works all the time.

## An Aside About Story/Complexity Points

Many agile methodologies will use the concept of story points.
They will assign a number based on the relative complexity.
A is 1 point, B is 2 points, and maybe C is 4 points because it is twice as difficult as B.
Fix a time interval such as a two-week sprint.
Add up all those points the team accomplished, and you have an idea of how many points a team can accomplish in a given time interval.

Story points allow the idea of complexity to be abstracted and applied across a team.

I'm not going to get into much further depth on that here.

# Wrapping Up

Estimating accurately can be difficult when developing software, and this post only scratches the surface of that.
There is so much more I haven't even touched on here, such as "The Cone of Uncertainty": The earlier an estimate is made or the larger an estimate is, the more uncertain it is.

I encourage anyone who is in a role that requires estimations of any sort, but particularly estimates based on time to read Chapter 2 of "The Mythical Man Month".
There's a lot more to it than what I put in this post.
It definitely made me re-think a few things about software estimations and how team structures affect software estimates.

As a full disclosure, while I can work in both, I have typically had bad luck in environments that estimate, measure work, and project schedules solely on time.
I have had much more positive interactions in environments where dates are projected based on past accomplishments of a team and the complexity of the project, than on estimated person-months.
When it comes to development processes, I strongly prefer environments that have a collaborative team atmosphere and estimate in story points.
