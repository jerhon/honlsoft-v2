---
date: "2021-02-13"
title: "Running a Minecraft Server in Docker"
tags: ["docker", "minecraft", "minecraft-server"]
type: "blog"
description: "Running a Minecraft Server in a Docker Container"
---

I've been playing Minecraft for years with my kids.
I don't know if we will ever stop.
We have routine "family Minecraft" sessions where we will sit down and all of us will play together in a world.
It's a great way to all play a game together.
Minecraft is also one of those unique games that you can play across tablet, PC, and console.
It also is a great game for different age ranges too.
My youngest kids love it right along with my older kids.

When we play together, we create worlds that end up being tied to one of our profiles.
That person needs to sign in order to keep playing it on local play.
We can play over the LAN, but again it requires to be signed on to a specific profile to play the same world.
LAN games are great especially when we play on different devices, but the limitations just made me want more seamless experience.

Due to the shortcomings of the normal LAN play, I decided to set up a Minecraft server locally at our house.
It's not a difficult task, but does take some light file editing here and there and some minor administration work to make sure it stays up and running properly.

The download for a regular Minecraft server installation is here.

https://www.minecraft.net/en-us/download/server/bedrock

Rather than running it just per the directions, I decided to make a Docker image to simplify the deployment.
That way, so long as I have Docker running on a machine, I can download and install a Minecraft server with a few easy commands.
That alone makes Docker a really great tool for this application.

To run the application it requires getting the ```docker-compose.yaml``` from my GitHub repository, following a few instructions to fill in a few environment variables with the source to download the image from and some server settings.
After that running ```docker-compose up```, and it handles the rest.

# How it Works

The docker image itself is based around a bash shell script that's run when the docker container starts up.
The shell script automates several manual steps you'd normally have to take setting up a Minecraft server.

First, it downloads and extracts the Minecraft Bedrock Server zip package.  I do not redistribute it in the docker image as the Minecraft Bedrock Server EULA explicitly prohibits redistribution of it.  That mean, this is really just a fancy way to automate running it in a container.

Second it sets any server properties on the Minecraft Server.  The minecraft server contains a file that controls many of the configurable parameters for the application.  This takes any of the expected properties in the server.properties file and if there is a matching environment variable it replaces it.

Finally, it runs the minecraft server.

Simple, right?

The final piece of this is mounting the /app/minecraft directory to a local directory on the machine.
This avoids having to download the minecraft server on every single run of the application.
An alternative is to create a docker volume.
However, this isn't entirely required, just a runtime optimization that can be done.

The only trouble I ran into was exposing the Minecraft Server port.
I did not realize it was a UDP port, which is very important.
Not many services are exposed via UDP, so it's a VERY easy mistake to make.
UDP needs to be explicitly specified on the exposed port when run by Docker for the traffic to flow through.

# Wrapping Up

Overall, this was a fun little exercise, and I'm excited to get some more time playing on the server with my kids over this long weekend!
For more information, check out the [GitHub repository](https://github.com/jerhon/minecraft-bedrock-server-docker) and the [Docker Image on DockerHub](https://hub.docker.com/repository/docker/jerhon/minecraft-bedrock-server).
