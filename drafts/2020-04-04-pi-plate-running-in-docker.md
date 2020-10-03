---
date: "2020-04-04"
title: "The Pi-plate: Running in Docker"
tags: ["pi-plate", "docker", "website"]
type: "blog"
---

In the previous posts for my pi-plate project, I've discussed the how I set up my raspberry-pi as a kiosk, and how I set up a raspberry pie to operate as a Kiosk, and the angular application that was built to run it. In this post, I'll be describing how the angular application is being hosted on a nginx docker container.

## Using Docker

Docker is a technology that's taken the IT world by storm over the past decade. It takes application compartmentalization and separation to it's next logical step. Docker provides am easy way to run an application in a container on a server.

A container can be thought of as a boundary around the application, it provides a lot of benefits, but some of the main benefits are:

- The network can be isolated from other applications, and ports the container exposes outside the container need to be explictly defined.
- The application has no knowledge of other applications on the system outside of the container. It is only aware of itself and applications running in it's container.
- The container can be sized to prevent over utilization of resources.
- The container only gets access to the portions of the filesystem shared with it.
- The container and all it's dependencies are packaged together as a cohesive image.
- Images are built in layers, and dependencies aren't copied from image to image.
- A container can run anywhere docker is installed on the same OS. Microsoft and Docker are partnering to quickly break down this barrier so that Linux containers can also run on Microsoft infrastructure.
- There are a wealth of security scanned pre-built docker images for common application frameworks such as .NET Core, Java, etc...

There are so many benefits to using containers-- it's tough to state them all here!

## Building the Docker Image

The application itself is built in a multistage Dockerfile with two steps.

1. Build the angular application. (The lines starting with "FROM node:latest" down to "FROM nginx:latest".)
2. Copy the build of the angular application to a new image based on nginx to serve. (The remaining lines in the file.)

This is really useful. This prevents from having to install less dependencies on my Raspberry Pi. I do not need to install node and nginx on my Raspberry Pi and set them up. They are already pre-configured in the docker images for node an nginx. Since docker is running on the machine, it is enough to build the application.

A Dockerfile contains the instructions to build the container. Here's the Dockerfile for the application at the time of the post.

```Dockerfile
FROM node:latest as build

ADD . /app/src
WORKDIR /app/src
RUN npm install \
    && npm run build

FROM nginx:latest
COPY --from=build /app/src/dist/pi-plate /usr/share/nginx/html

EXPOSE 80
```

## Building and Running the Application

When I wrote the application, I wanted a CI to build the application and push the image to it's built in container registry. Since I'm using GitHub, this takes a bit of extra work. GitHub doesn't have any runner's to build applications for ARM processors. It is possible by setting up a private runner.

Rather than trying to automate it, I've just settled on pulling down the repository on my Raspberry Pi through git and building the image on it.

In the main directory of the repository ```docker build . -t

## Serving the Pi-plate Application

The pi-plate application is served in a [nginx http server](https://www.nginx.com/). Nginx provides a base image which

# Wrapping Up

I hope you've enjoyed this series and project. Now, I have to deal with the fact that I've built a interactive touch screen driven application in midst of a global pandemic. I will likely keep it at home now.
