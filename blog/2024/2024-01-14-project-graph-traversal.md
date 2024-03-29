---
date: "2024-01-14"
title: "Project Graph Traversal with the MS Build SDK"
tags: [".NET", "MSBuild SDK", ".NET 8"]
type: "blog"
description: "Project Traversal with The MS Build SDK"
---


# Happy New Year!

Happy New Year!

I've been taking a break for a while from my blog.
I had been spending some extra time outside of work trying to push forward an initiative inside work to move my workplace forward on containers.

It's just been one of those things I personally find important in technical leadership. 
Learn new things to level up, and share those things with others.
It took a little extra effort to do that.

It ate into my personal time a bit I used to blog and look at tech the past few months before the Holidays.
I also took a break from tech over the Holidays to try recharge a bit and maximize my time with family.
Now that I accomplished my goals there, I'm planning to get into some blogging again this year.

# Project Graph Traversal with the MS Build SDK

A tidbit I learned this past week was a very convenient way to traverse MS Build projects.
The MS Build SDK has tons of gems when needing to work with .csproj or solution files.

It really makes sense to use it too.
The `.csproj` files are so complicated, using the tooling helps reduce the number of issues that can arise from using it.

In short, I had a problem where I needed to traverse the project graph of a solution filter.
I wanted to see if any projects were missing in the solution filter.

Being able to resolve the project graph of a solution was one of those key facets I needed to be able to solve.
I expected to do a lot of manual coding to resolve it.
Thankfully, there was already a good solution out there in the MS Build SDK.

# Microsoft.Build.Graph.ProjectGraph

The [ProjectGraph](https://learn.microsoft.com/en-us/dotnet/api/microsoft.build.graph.projectgraph) class is the key to this.
It has a constructor which takes the path to a project file or multiple project files.
It will then iterate through the projects and give the full dependency tree.

# Loading the MSBuild SDK

Using the MSBuild SDK is a little tricky, it's not just a NuGet package that can be imported and just works.
There is a little extra setup that needs to occur.

There is an `Microsoft.Build.Locator` package which is needed to load the MSBuild SDK.
It does this from a local installation on a machine.
The details of this are documented here. [MSBuild Locator Setup](https://learn.microsoft.com/en-us/visualstudio/msbuild/find-and-use-msbuild-versions)

This must be done before any code is referenced from the MSBuild SDK, and outside any methods that reference the SDK.
In my program, this ends up being a few extra statements in my Program.cs

```csharp
// Register the default MSBuild SDK instance
var defaultInstance = MSBuildLocator.RegisterDefaults();
Console.WriteLine($"Using MSBuild at '{defaultInstance.MSBuildPath}' to load projects.");
```

Now the code to do the traversal.  It's a one-liner! A lot easier that what I had planned to do.

```csharp
// Load the project graph
ProjectGraph projectGraph = new ProjectGraph(args);
```

Finally, I'm going to obtain a list of all the unique projects found in the project graph:

```csharp
// Get the unique projects in the graph
var uniqueProjects = projectGraph.ProjectNodes.Select((p) => p.ProjectInstance.FullPath).Distinct().ToArray();

// Display all the projects in the project graph to the console
foreach (var project in uniqueProjects) {
    Console.WriteLine(project);
}
```

That's it.

# Running the Console Application

I tucked this away in a little console application and pointed it at a project file from the Chess project I've been writing off and on over the past half year or so.

Here is the output

```
Using MSBuild at 'C:\Program Files\dotnet\sdk\8.0.100' to load projects.
C:\Users\jerho\src\hs-chess\src\Honlsoft.Chess.Console\Honlsoft.Chess.Console.csproj
C:\Users\jerho\src\hs-chess\src\Honlsoft.Chess\Honlsoft.Chess.csproj
C:\Users\jerho\src\hs-chess\src\Honlsoft.Chess.Uci.Engine\Honlsoft.Chess.Uci.Engine.csproj
C:\Users\jerho\src\hs-chess\src\Honlsoft.Chess.Uci.Client\Honlsoft.Chess.Uci.Client.csproj
```

It outputs the SDK version it's using, and then the list of projects in the graph.

# Wrapping Up

[The full sample is available on GitHub.](https://github.com/jerhon/hs-sample-projecttraversal)

I hope this helps someone else out there looking to do some graph traversal with MSBuild projects.

I'm looking forward to writing some more blogs in the new year!
