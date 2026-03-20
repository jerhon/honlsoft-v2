---
date: "2022-01-18"
title: "Dockerfile Tips and Tricks for .NET"
tags: [".NET", "Docker"]
type: "blog"
description: "A few of my tips and tricks for docker files."
---

I've been working with Docker for close to 4 years now.
My first project was a React application that I needed to deploy an on-premsis server.
I was fairly new to containers, so I decided I'll just install it on a Linux server and see what the fuss is about.
Once I had something working, I was hooked.
They just made life so much easier!

While it is very easy to containerize applications, there are a few tips and tricks I've learned over the years that really make Docker much more valuable to me.
Here are three things I wish I would have known when I started using Docker.

## Multi-Stage Builds

My first attempt to build something in Docker was to build an application on a build machine, and then add it via a Dockerfile.
While this worked, it missed a significant pro of containers.
That is multi-stage builds.

Before containers, in order to build something on a build server, I had to install lots of SDKs and Development tools to get the software to build.
It could lead to a nightmare of configuring build machines, ensuring the right things were installed, and dealing with configuration mismatches.

With multi-stage builds, the entire build process for a container can be performed within Docker itself.
This means, rather than having to install .NET 6 SDK on my build server, so long as I have Docker running, I can use a Docker container with the .NET 6 SDK on it to build my application.

This requires me to build two images.
The first is the "build" image, the second being the "release" image.
The build image is solely for building the application, once the application has been built, the resulting files are copied over to the release image.
This doesn't add much complexity as the Dockerfile format already supports this.

This also has the benefit of minimizing the final image.
The build image typically references an SDK, and the "release" image just uses the runtime.
For example, the build image would use the .NET SDK, and the release image would use the .NET runtime.
Or- for toolsets that compile down to an executable with no external dependencies no extra runtime may be needed.
Typically application runtimes are MUCH smaller than their SDK counterparts.

The multi-stage builds don't need to be limited to just two stages either, any number of stages can be added.

## Caching Dependencies

A lot of languages and developer toolsets come with package managers now.
Taking the time to download those dependences can be time consuming.
When making a Dockerfile, if I have to pull those down every time I build, it can take a lot of time.

One trick that can help speed this up is to use caching as part of the build process.
The `docker build` command cahces layers by default, so a few tricks in the Dockerfile can help this.

Rather than doing a blanket COPY statement at the top of the Dockerfile to copy all the source, pick out the files that are used to restore the packages.
In the latest .NET the .csproj files, in NPM / web project that would be the `package.json` and `package-lock.json` files.
Then run the command to restore the packages like `dotnet restore`.

The magic comes on subsequent builds.
Docker will cache a layer for each command run, and also check its cache to see if there is a coresponding output layer for a command for a given context.
In short- if the package.json or .csproj files do not change, Docker will use a cached layer.
This prevents the work of having to download and restore the packages again.

The main benefit here is a much quicker development cycle.
Avoiding costly dependency restores.

## Ordering Of Commands is Important

With the knowledge of caching from the previous tip, the ordering of commands becomes much more important.
The final image builds the image as layers.
If a command or the context of the build changes earlier in the file, all steps afterwards usually get re-run because they aren't cached any longer.

This means ordering is important.
Do steps and add things that are less likely to change earlier in the file.
This will speed up the building process.

## Reference Docker File

Here is a reference `Dockerfile` from my time-log application putting these things into practice.

```Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:6.0 as build

WORKDIR /app/src
COPY Honlsoft.TimeLog.Console/Honlsoft.TimeLog.Console.csproj Honlsoft.TimeLog.Console/Honlsoft.TimeLog.Console.csproj
COPY Honlsoft.TimeLog/Honlsoft.TimeLog.csproj Honlsoft.TimeLog/Honlsoft.TimeLog.csproj
COPY Honlsoft.TimeLog.Markdown/Honlsoft.TimeLog.Markdown.csproj Honlsoft.TimeLog.Markdown/Honlsoft.TimeLog.Markdown.csproj
COPY Honlsoft.TimeLog.Tests/Honlsoft.TimeLog.Tests.csproj Honlsoft.TimeLog.Tests/Honlsoft.TimeLog.Tests.csproj
COPY Honlsoft.TimeLog.sln .
RUN dotnet restore

COPY . .

RUN dotnet test

WORKDIR /app/src/Honlsoft.TimeLog.Console
RUN dotnet build -c Release -o /app/bin

FROM mcr.microsoft.com/dotnet/runtime:6.0
COPY --from=build /app/bin /app/bin

WORKDIR /app/logs
VOLUME /app/logs


ENTRYPOINT ["/app/bin/hs-time-log"]
CMD ["--help"]
```

## Wrapping Up

I hope you find these tips useful, and they'll help you to construct Dockerfiles in the future!
