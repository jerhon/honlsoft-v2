---
date: "2022-04-08"
title: "Software Architecture: Containers"
tags: ["Containers"]
type: "blog"
description: "A brief introduction to containers."
---

Containers are a transformational technology that enables an enterprise to move faster by using automation and better hardware allocations.

As I'm doing some learning around Kubernetes as one of my technical development goals this year, I've decided to switch gears from my pure Software Architecture blogs to focus more on containers and Kubernetes for a few months to support those personal learning goals.
While containers in and of themselves have less to do about software architecture, their usage open up a lot of possibilities around software architecture.
This first post is really setting the stage and very brief introduction to containers for my future posts. 

## The Old Way of Applications and Infrastructure

We've all been there.
The story goes something like this.
I have a new application, and I need to deploy it somewhere.
I ask the infrastructure team to spin up a new VM, and I install the application.
If I'm being "really efficient", maybe I can group a few of the applications into a single server.
If I'm "really really efficient", I've got something like an Ansible playbook to stand up the server and install the application.

However, one day down the road this strategy ends up haunting infrastructure.
They end up having hundreds of VMs and they each only do a few things.
The resources then get tied to the VM, and get reserved.
The resource utilization is low in some places because they are only used as one off applications, but they need the resources to deal with peak demand.
Other servers become over utilized due to underpowered VMs, which need to be re-evaluated, or additional VMs need to be brought up if the application supports horizontal scaling.
Running the same application more than once on the same server is typically completely out of the question.

I've seen multiple enterprises struggle with this.

In addition to just installing the application, the old way of installing required, enumerating the dependencies of an application, and ensuring they were installed on the VM, and then installing the application.
Then also dealing with all the updates to each individual dependency for the application.
On top of that, dealing with keeping the dependencies in sync on each server.
This lends itself to the common problem of: I'm running this application on Windows Server with this hotfix applied, and this other Windows Server does not have this hotfix applied.
This often is not an issue, but when it is, it is PAINFUL.
Debugging OS level and underlying dependency differences like this can be an absolute time waster.

In short, the unit of deployment in the old way of deploying an application was a new virtual machine.

While this worked for the time and enforced isolation between applications both at both the application and resource usage level, it can became difficult to manage.
This is because, the most granular unit that can be deployed to a VM is an operating system.
Operating systems are large and expensive and have a lot of overhead.

## Containers to the Rescue

Containers have changed this.
A container is the application and all it's dependencies bundled into an image.
Containers change the unit of deployment from the operating system to the application level.

## Container Runtime

A container is executed by a runtime and provides isolation between running containers.
This isolation can happen at multiple levels that weren't possible on an individual machine: at the networking level, the device level, the process level, the OS level, etc.

For example:
When an application runs in a container, it's possible to only expose a single network port from the container even if it has many.
When a container needs files the runtime can share a small subset of files, rather than potentially have access to a much larger file system.
A container runtime can run the same application MANY times on the same server in isolation from other instances of the running application.
There are so many options-- the amount of isolation that can be established by running an application in containers is really amazing. 

Once a container runtime like Docker, containerd, podman, etc is installed on the server, it can run the container.
There's no need to worry about installing all the application specific dependencies on a server.
There aren't any dependency conflicts between applications.
The dependencies are bundled and isolated per application. 

Many of these runtimes will build in resiliency features that aren't available in plain old applications today.
Health checks to ensure the container is still running correctly.
Failure mechanisms such as restarting the container.
Per application resource limits, so on and so forth.

For those getting started with containers, I strongly suggest Docker and Docker Desktop as the first container runtime they use.
It's very friendly and has a large developer ecosystem around it.
It works on Windows, Linux, and Mac.
If the cost of a subscription is something you don't want to deal with immediately, Rancher Desktop is newer, but another great option for people just getting started.

## Container Registries

Container images are stored in registries.
These registries keep the images so container runtimes can look up and download an image when it needs to be run.
This normalizes where containers are kept and makes the continuous integration and continuous delivery process for containers much easier.

Container images are immutable and layered.
This allows reuse of space amoung layers.
For example, if I have 3 different applications depending on the same .NET SDK base container image.
They reference the shared .NET SDK container image.
This is a huge difference over VMs.
Everything in disk is duplicated at the OS level.

This enables things such as scanning all my container images for security vulnerabilities.
It can also keep multiple versions of the same application in the registry.

For those getting started with containers, I would suggest either using a cloud based container registry such as DockerHub.
Or- if your development lifecycle tooling has it built in such as GitLab or GitHub, I would consider that as well.

## Continuous Integration and Continuous Delivery in a Container World

When I want to run an application in a container, my process can look nearly identical for many applications.

A typical build and deployment pipeline is split between two different processes.
The continuous integration process which builds on a branch and generates an artifact for the build.
The continuous delivery or deployment process which takes the artifact from a branch build and deploys it to an environment.

A container based CI process looks something like this.
* Download the source code.
* Use the container runtime to build the container image.
* Insert a few extra code quality steps such as running unit tests or running a SAST / DAST, etc.
* Push the container to a container registry.

A container based CD process looks something like this.
* Pull the container image.
* Set up any environment specific configuration files for the container and it's resource needs in the environment.
* Run the container on a container runtime or orchestrator.

There are more advanced strategies that are unlocked as well.
For example GitOps, where my CD process simply watches a Git repository and updates the infrastructure whenever there is a change in the repository.

The idea here isn't to enumerate all the options that are available.
Instead, it is to enumerate a simple deployment methodology that works with containers.
It typically doesn't need to change much from application to application.
Templating out a CI / CD process and it will work in many instances for many applications.
There will always be slight differences in networking and how the application is reached, but over all those become configuration problems, however the core processes don't need to change much.

This is one of the huge benefits of adopting containers.
With building, storage, and execution of a container becoming more standardized operations around applications, they can be automated much easier than before.

When getting started, this will likely be based on the developer tooling you use.
If you're already using tooling such as Azure DevOps, GitHub, or GitLab, most can automate docker builds and deployments.
So, I would suggest getting started with those as those are tools people in your organization are likely already familiar with.

If these developer tools are hosted on premises, you'll likely work your build administrators have to do to get it started such as getting docker installed on a machine.
If you're lucky enough to have cloud hosted development tools and infrastructure, then these are tools are usually set up and ready to go.

Container orchestration provides tons of options on how things are deployed, but I will follow this up in future posts.

## Container Software Ecosystem

There are so many tools that are available for containers.
Often times there are multiple tools that do the same thing.
This is a good and bad thing.
The good means containers are popular and the chances of finding an off the shelf solution to an infrastructure problem around containers is higher.
It also prevents lock in when the ecosystem has multiple options for things like container registries, container runtimes, etc.

The hard part is there is a high cognitive load when starting with containers.
With so many tools, it can be hard to know where to start.
It can also make implementing containers look much more difficult than it really is.
However, the same can be said of many technologies and tools, and just starting out simple tooling like Docker Desktop and the others I've pointed out in this post are good starting points.

Looking at the end product and saying how do we get there can be a very daunting task for organizations with no prior experience in containers.
Knowing what tools are available knowing what fits an organization's use cases is much of the battle.

## Wrapping Up

There is so much more to containers.
It's impossible to write one post and cover everything around them.
I've been using them for 4-5 years.
It's really become a game changer to building and deploying software.
However, with all the innovation happening in this space there is always something new to learn.

I have not discussed container orchestration at all, but will talk more about that in future posts.
I wanted to write this brief article that very quickly outlined some basic concepts before I begin talking about more complex topics such as Kubernetes. 
