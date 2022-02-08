---
date: "2022-02-01"
title: "Using GitHub Actions to Build Docker Images"
tags: ["github", "docker"]
type: "blog"
description: "Utilizing GitHub Actions to Build Docker Images"
---

Docker is a great tool for deploying applications.
One of these primary reasons is packaging up an application in an image which can easily be deployed across systems.
The Docker image needs to be built and it needs to be pushed to a container registry.
Docker can then use the container registry to pull images and run them on local machines and servers.

GitHub provides an excellent capability to do this for simple projects with its GitHub Container Registry.
It's built in and free for public repositories.
It is extremely easy to automate through GitHub Actions.
All the build tools and runners are there just sitting waiting to pick up a build to run.
I don't have to spend hours / days setting up machines with build agents and the perfect build configuration on them.

While I am using Docker, there are plenty of other container runtimes to use as well such as Containerd and Podman.
The image specification to build a container has been standardized as the [OCI Image Format](https://github.com/opencontainers/image-spec).
However, Docker is one of the most popular and has excellent cross-platform support, so that's what I typically use.
It's easier to use, which helps when I want to introduce others to containers.

In this post, I'll be referencing [my project around building a Markdown Time Logger](../2021/2021-12-31-time-tracking-in-markdown.md).

## The Dockerfile

First, a Dockerfile is required.
You can find the [example Dockerfile in the GitHub repository under the src folder](https://github.com/jerhon/markdown-timelog/blob/main/src/Dockerfile).
There are all kinds of examples over the web on this.
I'm not going to go in depth in this article on building a container.

In short the Dockerfile contains the instructions to build an image from my source code.
Since it's a multistage Dockerfile the image will be built in Docker and everything will be output as a Docker image.
After building a docker image, it will store locally, and it needs to be pushed out to a registry.
I'll be pushing my image into GitHub Container Registry, which currently is free for public repositories / images.

A Dockerfile at a 10,000, foot view is a set of instructions to build my application and package it up as an image.

## Defining the Workflow

GitHub Actions takes the same stances as most major build automation tools do today.
A file defines the actions to take for the build.
The file is defined in Yaml, and stored alongside the source of the repository.
All workflows are defined under the `.github/workflows` directory.
Create a yaml file with the proper schema for a GitHub Action workflow and store it under that directory.
GitHub will automatically pick it up.

The workflow for this will have three main sections.
1. The trigger.
2. Redefine commonly used variables.
3. The steps to build the application.

## Defining the Trigger

There are a host of things that can be used as a trigger for a GitHub Actions workflow.
One of the very powerful things about this, is that the actions really allow automation of all aspects of working with GitHub.
It is not just a tool to automate application builds.

I could set up a trigger to deploy the latest build when a github issue is closed.
I could create a branch in the git repository when an issue is opened.
And of course, I can trigger my application to build when a branch or tag is pushed.

That's what I'll be doing.
I'm going to set up my build and push action to only occur on the main branch (in which case it will publish as a GitHub tag of latest) or when a tag is pushed of the format v1.0 for a version of the software.
I also included a build folder in case I just want to debug the build.

```yaml
on:
  push:
    branches:
      - 'main'
      - 'build/*'
    tags:
      - 'v*'
```

## Defining Extra Variables

When I built this workflow, I was comparing other starter workflows with GitHub and one of the useful things they did was set up variables for common values.
This is not an everyday occurrence for me so referencing these, and the github actions documentation is a must.
It helps me to build best practices into my workflows, and learn from others as I do it.

Here's a few great links:
* [GitHub Actions Starter Workflows](https://github.com/actions/starter-workflows)
* [GitHub Actions Reference](https://docs.github.com/en/actions)

This was one of those best practices, redefining commonly used variables.

```yaml
env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}
```

Both will be used through the rest of the file.

## Defining The Workflow Steps

The actions in the jobs are just a list of steps.
The needs for the job are indicated as this will run on a build agent with ubuntu-latest.
The steps are then listed in sequential order of when they will be run.

Many of these steps are familiar for any Docker build.
* Checkout the files from the Git repository.
* Login to the ghcr.io container registry. 
* Setup Docker
* Get metadata for use later in Docker.  This avoids having to do manual work to set up the tags and labels for the Docker images.
* Finally, build the image and push it.  The build and push has two steps, but I'll explain that after the YAML file.

```yaml
jobs:
  build-and-push-docker-image:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Log into registry ${{ env.REGISTRY }}
        uses: docker/login-action@v1
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Setup Docker buildx
        uses: docker/setup-buildx-action@v1
      - name: Extract Docker metadata
        id: meta
        uses: docker/metadata-action@v2
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
      - name: Build and Push Versioned Docker Image
        id: build-and-push
        uses: docker/build-push-action@v2
        if: ${{ github.ref != 'refs/heads/main' }}
        with:
          context: ./src
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
      - name: Build and Push Latest Docker Image
        id: build-and-push-latest
        uses: docker/build-push-action@v2
        if: ${{ github.ref == 'refs/heads/main' }}
        with:
          context: ./src
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
          labels: ${{ steps.meta.outputs.labels }}
```

### Two Separate Build and Push Steps

I set up two separate build and push steps.

The first of the two steps is to build the docker image for any branch that is not main, and to push it out with the tags.
From the workflow, if it's triggered on a v2.0 tag, the docker image should get pushed with a v2.0 tag.

The second is a special case.
If the branch is the `main` branch, push the image with the `latest` tag in docker
`latest` is special, where if `docker run` is executed without the tag on an image name, it will take the `latest` tag by default.

As is common practice, I consider the `main` branch to contain the latest releasable code.
I wanted my docker images to mirror that.

## Viewing the Containers

The odd thing about GitHub Container Registry, the packages are shown under a user or organization, not necessarily under the GitHub project.
To see this container you'd have to go [to my GitHub profile under the packages tab](https://github.com/jerhon?tab=packages)

## Container Names and Tags

One thing that really confused me the first time I started using docker was the naming convention around images.
While I believe more folders can be added, the most common convention is

`[REGISTRY]/[USER]/[IMAGE]:[TAG]`

For example, `ghcr.io/jerhon/markdown-timelog:latest`.
Everything before `:latest` tells where to get the container image from.
The `:latest` portion tells which specific image to use.

If the initial registry is left off, then it's assumed the image is coming from Docker Hub.
The registry can also contain a port.
This is helpful in cases when a network administrator changes or requests the default port change on a private docker registry.

## Wrapping Up

So far I've enjoyed getting to use GitHub Container Registry and GitHub Actions.
It's nice to have a full-featured container registry available for public projects, especially after Docker's recent changes to it's licensing terms.

While this post is very specific to GitHub Actions, many of the top DevOps products(like GitLab, Azure DevOps) today have something similar.
I plan on taking this workflow and generalizing it into a workflow repository to re-use it when appropriate in my GitHub docker applications.

