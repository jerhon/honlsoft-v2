---
date: "2022-10-05"
title: "Creating Containers in .NET 7 with the .NET CLI"
tags: [".NET", "Containers", ".NET 7"]
type: "blog"
description: "How to Easily Build a .NET Container in .NET 7"
---

One really handy feature with .NET 7 is the ability to create containers directly from the dotnet command line.
This lowers the bar to entry with container development, and if you've got a standard ASP.Net application, it's easy to throw it in a container. 

I just want to put a disclaimer before I begin.  This functionality is currently in preview.

## Example

Here's an simple example of building a docker container in .NET in just a few simple steps.

### Create the Project

Using the dotnet command line, make an Asp.NET Core WebAPI project.
Then add the package needed to build the application as a Docker container.

```
dotnet new webapi -o Honlsoft.Examples.DotnetContainer
cd Honlsoft.Examples.DotnetContainer
dotnet add package Microsoft.NET.Build.Containers
```

### Modify the Startup Code

Before building the container, check out `Startup.cs` it contains a snippet which will redirect to HTTPs.
This line needs to be removed as we'll just support HTTP in this example.
The line is this:

```csharp
app.UseHttpsRedirection();
```

### Build the Container and Run It

Two more commands and we're off and running.

``
dotnet publish --os linux --arch x64 -p:PublishProfile=DefaultContainer
docker run -it --rm -p 8080:80 honlsoft.examples.dotnetcontainer:1.0.0
``

The publish command will create the container and store it in our local docker registry.
The second command will run the container in interactive mode, remove it after it's done, and redirect any traffic from port 8080 to port 80 in the container.

### Test it Out

Using httprepl, I'm going to connect to :8080, and make sure I'm getting back information from the endpoint.

```
(Disconnected)> connect http://localhost:8080
Using a base address of http://localhost:8080/
Unable to find an OpenAPI description
For detailed tool info, see https://aka.ms/http-repl-doc

http://localhost:8080/> GET /WeatherForecast
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: Thu, 06 Oct 2022 00:47:05 GMT
Server: Kestrel
Transfer-Encoding: chunked

[
  {
    "date": "2022-10-07",
    "temperatureC": 1,
    "temperatureF": 33,
    "summary": "Warm"
  },
  {
...
```

The response was truncated for brevity.

## The Pros/Cons

This is by far the easiest workflow I've used to create a .NET container.
No need to muck around with a Dockerfile, just build and go.
This is a great experience for just getting started with development!

This isn't without its downsides.
The image isn't hardened, we're clearly using HTTP, and we've lost some of the configurability that's typically available in hand crafting a Dockerfile.
However, just building a docker container locally for the development, this is no big deal.

Also, things such as getting configuration into the image need to be taken into consideration.

There are a number of options that can be tweaked in the `.csproj` file.
However, that list is pretty limited right now.
[That documentation is here](https://github.com/dotnet/sdk-container-builds/blob/main/docs/ContainerCustomization.md).

This is fairly new functionality and the NuGet package to build the container isn't even at version 1.0 yet, so I'm hoping they will expand functionality in this space.

## Wrapping Up

Getting started with containers can be daunting and there is a lot to learn.
By introducing simplified tooling for building containers, I believe .NET will really help out those getting started.

This is just an example of a small change that can really make development with .NET in containers easier than previous versions.
