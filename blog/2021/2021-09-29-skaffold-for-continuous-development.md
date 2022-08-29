---
date: "2021-09-29"
title: "Using Skaffold for Local Kubernetes Development"
tags: ["documentation", "Skaffold", "Kubernetes", "MiniKube"]
type: "blog"
description: "How to use Skaffold for Local Kubernetes Development."
---

I've been a fan of Docker Desktop for years.
Docker compose was my go to for developing multi-container applications locally.
However, while it was polished there was always a gap between building docker compose files and then running it in Kubernetes.
Docker had done things over the years to simplify this, but I wanted to automate more of my local development experience.
The recent changes to Docker Desktop's Licensing model started me on a search to see what other tools are available.

[Skaffold](https://skaffold.dev) and [MiniKube](https://minikube.sigs.k8s.io/docs/) quickly emerged at the top of my list.

## What is Skaffold?

Skaffold automates much of the daily grind of software development.
Through a configuration file, a set of containers can be defined, the kubernetes resources to deploy them, and how to access the deployed project.
Through that configuration file, Skaffold has a number of commands that can be run to then automate the software development process.

For example, I can run `skaffold dev`.
This will watch any container images I have in my project, if any file associated with the container image changes, it will rebuild and re-deploy it for me.
This provides a GREAT experience for building applications hosted in containers.

There are a host of other options that Skaffold provides.
Rather than rebuilding the container every time a file changes, I simply want to copy the file into the existing container.
That way I don't have to wait through a build cycle.
In cases when I have a development server that already deals with watching for changes, such as webpack-dev-server, it becomes possible to keep the tight hot reloading integration.

Theres so much else it can do such as setting up port forwarding, or providing a testing pipeline for my containers, or providing a way to extract the kubernetes resources for a project setup with Skaffold.

## Putting it Into Practice

While there are a lot of things Skaffold can do, I'm just going to focus on my main use case.

A few weeks ago, I wrote a blog article on using [MkDocs for Material](./2021-09-17-using-mkdocs-to-document-projects).
As my first exercise of using Skaffold, I decided this would be a good project to try it out on.
Overall, I just want to containerize the application and get the experience of having Skaffold build and deploy the container update automatically for me to my local development kubernetes cluster.

## Creating the Dockerfile

This is fairly straightforward since the author of MkDocs for Material provides a docker image with the tool.
This docker file is a multi-stage docker file.
The first stage(the first FROM) is going to build the documentation with MkDocs for Material container image.
The second stage(the second FROM) is going to take the results of the build and place them in a container with nginx to serve the application.

```
FROM squidfunk/mkdocs-material:7.2.8 as build
ADD mkdocs.yml mkdocs.yml
ADD docs docs
RUN mkdocs build

FROM nginx:1.21.3-alpine
COPY --from=build /docs/site /usr/share/nginx/html
```

## Creating the Kubernetes Manifests

I need Kubernetes manifests for my application.
Simple enough, just set up a deployment and a service.
For the application, I'm not going to expose it externally yet.
I'm just going to set up a service via a ClusterIP for now, and I can then later debug the service through a port forward setup by Skaffold.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: honlsoft-notes
  labels:
    app: honlsoft-notes
spec:
  ports:
  - port: 80
    protocol: TCP
  clusterIP: None
  selector:
    app: honlsoft-notes
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: honlsoft-notes
  labels:
    app: honlsoft-notes
spec:
  replicas: 1
  selector:
    matchLabels:
      app: honlsoft-notes
  template:
    metadata:
      labels:
        app: honlsoft-notes
    spec:
      containers:
      - name: honlsoft-notes
        image: honlsoft-notes
```

## Setting up Skaffold

The next portion becomes creating the `skaffold.yaml` file.
The easiest way to go about this is to run `skaffold init`.
This will create an initial file for skaffold based on scanning the directory tree.
It does a good job, but don't expect it to be perfect, it will likely be required to tweak the settings.
My ending `skaffold.yaml` file ended up looking like this.

```yaml
apiVersion: skaffold/v2beta23
kind: Config
metadata:
  name: hs-developer-notes
build:
  artifacts:
    - image: honlsoft-notes
      docker:
        dockerfile: Dockerfile
deploy:
  kubectl:
    manifests:
      - k8s\*.yaml
portForward:
  - resourceType: service
    resourceName: honlsoft-notes
    port: 80
    localPort: 9080
```

That's it!
That's all I need to get Skaffold to work with my K8s definitions.
Now, I make sure I have the right Kubernetes instance in context.

```
> kubectl config get-contexts
CURRENT   NAME             CLUSTER          AUTHINFO         NAMESPACE
          docker-desktop   docker-desktop   docker-desktop
*         minikube         minikube         minikube         default
```

Once I see I'm in the right cluster, I just run `skaffold dev`.
It will show the status of the container build and deployment with output on the command line.
Once it's done I can access my application at `http://localhost:9080` via the port forward defined in the `skaffold.yaml` file.
Usually a `kubectl port-forward` command needs to be run manually to get that access.

I edit a file and save, wait for the deployment, and hit refresh in my browser.
Like magic, my changes are there.

## The Key Takeaway

Now that I have this set up, anyone that has Kubernetes(via minikube) and Skaffold installed on their machine needs to do two things to run the git repo and develop.
1. Clone the repo
2. Run `skaffold dev`
After this they have a fully working development environment.

Really this is continuous deployment for a local development environment.
Make a change to code, and the change is picked up and deployed to the local development environment automatically.

## Wrapping Up

I've really only scratched the surface of what is capable with Skaffold in this blog post.
However, being a developer, this key use case was enough to sell me on the tool.
This is really the workflow with containers for local development that I have been on the hunt for.
From now on, when I develop with containers, this will be my starting point over Docker Compose.

See the full code base here: [honlsoft-notes by jerhon on GitHub](https://github.com/jerhon/honlsoft-notes).
