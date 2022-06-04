---
date: "2022-05-27"
title: "Container Orchestration"
tags: ["containers", "kubernetes"]
type: "blog"
description: "A brief introduction to container orchestration."
---

In a [previous post](2022-04-08-containers), I talked in brief about containers, and their benefits.
In this post I want to talk in brief about container orchestration before I get into more in depth technical topics on Kubernetes.

## Container Orchestration

Container orchestration is a way to manage running containers and the resources necessary for the containers.
Container orchestration also manages a cluster of machines and allocate various I/O resources.

## Orchestrators

A few years ago, there were several competitors for the space in container orchestration.
Docker Swarm, OpenShift, MESOS, and Kubernetes were a few of the big players.

Much of the usage around containers has now coalesced around Kubernetes.
OpenShift uses Kubernetes, and while the other projects are still going on, Kubernetes is a favorite right now.
The main reason being, most major cloud providers (Azure, Google Cloud, Amazon) support having a managed Kubernetes cluster of some sort.
Some cloud providers provide even higher level offerings where no knowledge of Kubernetes is needed to deploy containers.

This provides businesses extreme flexibility.
Build a containerized application, and it can run on premises or in the cloud.

I will focus just on Kubernetes.

## Kubernetes

Kubernetes is a container orchestrator.
A very high level way to think of Kubernetes is it is an API to run containers on a cluster of servers.
It abstracts storage, networking, and computing into resources.
These resources can be allocated through a set of APIs.

Kubernetes uses a desired state configuration methodology.
The APIs work define the desired state of the objects inside cluster.
Kubernetes processes run in the background and attempt to reconcile the cluster to it's current state.

### Running Containers

Kubernetes is deployed on a cluster of machines.
Each machine can become a node in the cluster, and Pods get executed on the machine.

In Kubernetes the basic unit of execution is a Pod.
A pod contains one or more containers as a cohesive unit.
Create a Pod through Kubernetes API, and the system goes into action and runs a process in the background trying to schedule that Pod on one of it's cluster nodes.

Additional concepts are built on top of this.
A ReplicaSet runs a Pod with the ability to scale it up and down.
After creating a ReplicaSet to run a pod with an http web server in it, I can increase the number of instances by simply updating the ReplicaSet to indicate the desired number of Pods I want running.

A Deployment uses ReplicaSets to provide 0 down time configuration changes to an application.
For example, when updating an application.
It creates a ReplicaSet and slowly scales down an older version of the ReplicaSet will scaling up the number of Pods running in the new ReplicaSet.

### Networking

Kubernetes also facilitates communication between Pods.

Inside the cluster, a DNS server runs. 
Pods can have their networking exposed through a Service resource.
The service resource defines how a Pod or Deployment can be accessed, and can load balance traffic across a number of Pods.

There are different ways to access these services.
For example through a ClusterIP, a NodePort, ExternalName, or a Load Balancer.
A ClusterIP gives an IP address reachable within the cluster.
A NodePort creates a port which is accessible from each node.
An ExternalName creates a DNS alias for an external service.
A LoadBalancer uses a cluster or provider based service to expose the pods externally to the cluster.

Through a consistent API I can schedule my application to run, AND I can configure the networking all the way up to the load balancer!
It's a pretty amazing feat.

### Storage

Kubernetes also deals with access to storage.
Storage is implemented through a standard interface.
So many storage providers have the ability to plug their appliances into kubernetes.

Through StorageClass, PersistVolumes and PersistentVolumeClaims, pods can mount volumes that appear as if they were disk storage.
Pods can mount volumes to local disk on the machines they are running.
There is so much more.

Through a consistent API, I can schedule my application to run, I can configure the networking all the way to the load balancer, and I can manage its persistent storage needs.

### Managing Configuration and Secrets

Kubernetes also manages application configuration and secrets.
Through the ConfigMap and Secret resources it's possible to change configuration values on the cluster through modifying those resources.
This allows swapping out different configuration values in applications depending on what cluster they are running in amoungst other use cases.

## The Downside

One of the major complaints I've heard around Containers and Kubernetes is the complexity it introduces.
I've only scratched the surface of the capabilities of Kubernetes in this post.
Running a full container ecosystem requires many moving pieces and Kubernetes is just one piece of that puzzle.
Learning all of it can be overwhelming when getting started.

However, isn't this true of any new technology?

Another complaint is how a development workflow to work with containers can be tricky.
The tooling has come a long way in the past few years: Dev Containers in VS Code, Skaffold, Tilt, Docker Compose, and many other projects make developing in containers much easier.

Getting there takes effort and commitment.
An agile mindset helps, and making small steps of progress verses trying to be the next Google or Netflix right away out of the gate.

## The Upside

Once the pieces of the puzzle in place, deploying containerized applications becomes a standardized process in an organization.
A cluster operator provides the necessary computing resources to run containers, and applications simply can be run in the cluster.

Development processes such as GitOps can vastly improve the visibility and auditing of changes.
Security controls can be added to scan EVERYTHING run in a cluster.
Containers can provide a per-application isolation that isn't possible without them.

Scalability is much improved.
To scale up or down an application, there is no more long VM requisition process with everything configured just right.
Just up the number of pods in a Deployment or ReplicaSet config.

Starting has also never been easier.
Today having a Kubernetes cluster is as easy as going through a wizard on your favorite cloud provider.
If your organization doesn't support that, Kubernetes distributions such as Rancher make it incredibly easy to get started on-premises.

## Wrapping Up

In short, Kubernetes provides a single consistent API to run and manage resources for a containerized application.

I love Kubernetes and containers.
It's a huge topic.
I'm committed this Calendar year to expand my technical knowledge in this space and will be writing more blog posts regarding it.
