---
date: "2021-01-30"
title: "NuGet Certificate Issues in Docker Builds"
tags: ["react", "web-development"]
type: "blog"
description: "NuGet Certificate Issues in Docker Builds"
---

I was playing around with a Covid-19 visualization application trying to publish a container to Dockerhub this morning.
The application is built in .NET 5 and React.
The image builds ended up failing with some certificate issues.

```
error NU3028: Package 'Microsoft.NET.Test.Sdk 16.5.0' from source 'https://api.nuget.org/v3/index.json': The author primary signature's timestamp found a chain building issue: UntrustedRoot: self signed certificate in certificate chain [/app/Honlsoft.CovidApp.sln]
error NU3037: Package 'Microsoft.NET.Test.Sdk 16.5.0' from source 'https://api.nuget.org/v3/index.json': The author primary signature validity period has expired. [/app/Honlsoft.CovidApp.sln]
error NU3028: Package 'Microsoft.NET.Test.Sdk 16.5.0' from source 'https://api.nuget.org/v3/index.json': The repository countersignature's timestamp found a chain building issue: UntrustedRoot: self signed certificate in certificate chain [/app/Honlsoft.CovidApp.sln]
```

Certification issues are not fun in Docker.
Thankfully, there are a few open issues on GitHub describing the problem and some potential resolutions for it.

* https://github.com/NuGet/Home/issues/10491#issuecomment-768377395
* https://github.com/NuGet/Announcements/issues/49

In short, if you run relying on `mcr.microsoft.com/dotnet/sdk:5.0` as a base image in a multistage docker file, you've got to update it to use an alternate base image that have the proper trusted certificates set up right.
The base image doesn't contain some necessary updates to trust some new certificates in NuGet Microsoft is using.
The .NET folks have made some pre-release images as a temporary way to solve this until an "official" image is released.
I did what they suggested and switched to `mcr.microsoft.com/dotnet/sdk:5.0.102-ca-patch-buster-slim` and it seemed to work fine.

Here is an example of the update I made to my Dockerfile in [this GitHub commit.](https://github.com/jerhon/covid-19-stats-v3/commit/1e01e1910eefbb5df241f43e156f3eb9ed591e15)

It's no fun when builds break, but imagine breaking the Docker builds of the world!
Thankfully, open source software has made these types of problems easier to deal with.
By the time I noticed it, the community had already dealt with it.
