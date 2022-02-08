---
date: "2022-01-21"
title: "Software Architecture"
tags: ["software-architecture"]
type: "blog"
description: "Reflections from 'The Fundamentals of Software Architecture."
---

I picked up the book [Fundamentals of Software Architecture](https://www.amazon.com/Fundamentals-Software-Architecture-Comprehensive-Characteristics/dp/1492043451/) and have been reading through it.
I had also read [Clean Architecture]() last year.
So, thoughts about software architecture have been on my mind as of late.
I decided I would jot down some thoughts from the books.

# What's Software Architecture

I like how the Fundamentals of Software Architecture defines a software architecture.
Most definitions I've come across deal with structuring the software into components.
While that is true of a system with a good software architecture, that is really the output of a software architecture.
There is much more to it than that.

In order to structure a piece of software there are all sorts of concerns of a system that must be met.
* The User Requirements
* Security
* Performance
* Observability of the System
* Software Development Lifecycle
* Deployments
* Malleability
* Software Team Dynamics
* Organizational Structure and Dynamics
* and so forth...

Anyone can learn to write software. But good code, and well-structured and thought out code takes those kinds of concerns in to play.
This requires making decisions about those concerns and structuring code to meet them.

Many of these concepts you will never hear, but are understood from different stakeholders.
A customer may never say they want their data to be stored securely as a requirement.
However, in today's day and age, if a data breach does occur they'll be glad you did. 

A customer will rarely say, I need you to capture enough telemetry in code to be able to debug complex issues when I call you and tell you something's wrong.
However, again it's understood.

So, software is really more than the sum of the business requirements.
There are so many competing concerns to building software, and it's important that those concerns are taken into account.

## Architectural Decisions

That's where architectural decisions come in to play.

Given the concerns to make up the software, what kind of decisions about how the software is built do I need to make?

For example, security around the system can be drastically different.
Am I in an environment with advanced security requirements?
Or- is this a simple line of business application with little personal data. 
This answer will vary greatly by context and software being built, and if the goal were to have the most secure system, then it would drive a much different set of structure to the architecture.

These types of questions drive the types of decisions that need to be made.
In the first situation, I should probably consider an HSM (Hardware Security Module) as a component of the architecture.
In the second situation, an HSM would likely be overboard, though I would secure my data to a certain degree.

Software Architecture will not to come up with a perfect system.
There will always be one more bug to find, and competing concerns.
Software Architecture decisions strive to find a balance between these competing concerns and meet a customer's expectations the best it can.

## Good Architecture

I am not advocating that all software stop and no progress made until all architectural decisions are made.
No, good architecture also should be adaptable, and part of that is being able to delay decisions.
This was one of the key tenants of Clean Architecture.

Software architecture takes these concerns into consideration, and these characteristics and concerns are not static.
Customers will change their mind.
Business systems will be updated to newer more modern software.
Teams will have people come and go.
Software frameworks will become obsolete.
All this can happen in the middle of a new green-field project.

Being able to delay decisions is a key hallmark of good architecture.
It's ok to have a plan and to think ahead.  Experience is important and being able to anticipate what needs to be done is very valuable.
However, to expect everything will go as planned in multi-month/year projects is unreasonable.
Good architecture will build this in to the software.
It will use the appropriate design and architectural patterns to avoid lock-in in code until it's absolutely needed.
Even in those cases, good architecture and design will make changing those areas of the system easier.

However, change is not free.
There is cost to change when things have already been implemented, and it may mean re-writing pieces or components of software, but good software architecture should not require re-writing all the software to change one aspect of the software.
With that in mind, a good architecture works to minimize the impacts of change, and makes things easier for a developer to change than if the architecture were not there.
Ideally, every component in the system should be built with the impression that one day this will need to change and even completely be replaced.

"The only constant in life is change."
That is no exception in software development, and one of the things that makes it exciting.
It is a basic need for companies in order to stay relevant and survive.

Good software is software that is structured to meet architectural considerations and adapt to change to those considerations over time.

## Bad Architecture

Why do I need GOOD architecture and think about it often?
Often I think of past projects and what could have been done differently to prevent scenarios like these.

1. Systems when a change is made, completely unrelated systems break (even when they don't change).
2. Systems where updates to a data store need to be processed in real time, but instead requires batch processing overnight because of how it was written.
3. Systems where the is no clear delineation for a software developer to know where to make a change or what it should look like.
4. Systems where a simple change that should take minutes takes hours or days.
5. Systems that suffer from resource exhaustion.
6. Systems that are hard to develop because they do not adhere to modern software engineering patterns and practices.

These are all simple examples of software that failed to live up to its potential.
Without adequate decisions given to the architectural considerations for the software, it can be very easy to miss the mark.
All that time spent on building a solution can easily go out the door.

This can mean loss of business EX: poorly performing software.
Loss of reputation for the business EX: critical security breaches.
Loss of capital for the business EX: resolving lawsuits or security mitigation features.

There are more consequences, but those are just the easy examples.

## Wrapping Up

I plan on writing more about software architecture in the coming year.
These posts are more personal to me rather than some of the more practical ones of I made X, go take a look!
It's not a skill I've been able to train much in my current job position.
So, I view my blog is a place where I can do that somewhat and hopefully get feedback from business connections from time to time.
