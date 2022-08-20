---
date: "2022-08-20"
title: "Publishing a NuGet Package Through GitHub Actions"
tags: [".NET", "GitHub Actions", "NuGet"]
type: "blog"
description: "How to publish a NuGet package through GitGub Actions."
---

I've been working with Roslyn Source Generators and have gotten to the pointer where there are a few I would like to use for other projects.
In order to share the code between these projects, I've decided to create a NuGet package.
While I've used NuGet for years and occasionally have had to create a NuGet package here and there for work, I've never actually published one to the official public NuGet repository before.

## NuGet

NuGet is the package system for .NET.
It has been around for a while and with .NET's push to open source, more and more projects and libraries have been pushed out to NuGet.
Especially with .NET 5+, more and more is being shipped as addon NuGet packages rather than with the core SDK.

Creating NuGet packages is fairly straight forward.
A NuGet package requires a specification and to be packed according to that specification.
It can then be hosted in a number of different ways.
For example, it's as easy to get started as using a file share.
Many major devops tools also support it now in their package management tooling, such as GitHub or GitLab.

## Setting NuGet Specification in the .csproj File

A few years ago, the .csproj file format was revamped and reduced a lot of the boilerplate and clutter in csproj files.
Assuming I'm building a 
One thing that's been added to .csproj files is the ability to specify NuGet spec information in the project file rather than having to maintain a seperate nuspec.

To define properties that typically went in the nuspec, I can add them like so in my csproj file.

```xml
<PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
    <LangVersion>10.0</LangVersion>
    <PackageVersion>0.0.1</PackageVersion>
    <Title>Honlsoft Dependency Injection Source Generators</Title>
    <Authors>Honlsoft</Authors>
    <Description>Provides several source generators to reduce boilerplate code needed with dependency injection in .NET.</Description>
    <Copyright>Jeremy Honl</Copyright>
    <PackageProjectUrl>https://github.com/jerhon/hs-dependency-injection-source-generators</PackageProjectUrl>
    <PackageLicenseExpression>MIT</PackageLicenseExpression>
    <RepositoryUrl>https://github.com/jerhon/hs-dependency-injection-source-generators</RepositoryUrl>
    <RepositoryType>git</RepositoryType>
    <PackageRequireLicenseAcceptance>true</PackageRequireLicenseAcceptance>
</PropertyGroup>
```

This can simplify the process as the csproj now contains all information necessary to bundle the nuget package.
It also reduces the number of places things like a version number need to be maintained.

## Using the .NET CLI to Package the NuGet Package

The `dotnet` CLI is one of the greatest features of the latest .NET.
It makes it easy to do common operations through the command line.
NuGet is an excellent example of this.
The `dotnet` CLI contains the ability to interact with nuget packages.

In the directory for the .csproj file I'm in, I simply need to run this in the csproj directory or solution directory:

```
dotnet pack -o nupkgs
```

It will now generate the NuGet package for me.
I'm going to have it generate all the NuGet packages for me in a nupkgs folder.
This would allow me to run the command at the solution level and have all the NuGet packages output in that folder.
This will make it easier to publish.

## Publishing the Package

Again, the dotnet CLI gives us a command to publish a nuget package.

```
dotnet nuget push nupkgs/*.nupkg -k ${{ secrets.NUGET_API_KEY }} -s https://api.nuget.org/v3/index.json
```

There are a few parameters here to note.  
`-k` defines the key to use, in this case I'll be using a value stored in a GitHub secret.
`-s` defines the destination to upload the package to, in this case it will be the public NuGet repository.

I am not going to go through the steps to set up an API key in NuGet.
It is fairly straight forward and documented well.
The only thing I will mention is to scope any security keys as narrowly as possible to the permissions needed.
For example, if this is for a single repository the key should really only be for the NuGet packages it supports.

## Versioning

The last topic to talk about is versioning the package.
I'm a strong supporter of using standard processes. 
[Semantic Versioning](https://semver.org/) is a must.

To denote a version of the package that should be published, I will be using a tag with a version number adhering to semantic versioning.
For example, when a particular version is ready to release, I tag the commit with something like `v1.0.0`.
The GitHub Action workflow will see the tag, and run the process to build and publish the NuGet package.

The biggest trick here is to get that version number from the GIT tag and applying to the package.
This avoids needing to maintain the version number in a lot of places.
Luckily, GitHub actions allows me to access the tag that triggered the action to take place.
However, I also need to strip the leading `v` off my tags as I'll use a tag such as `v0.0.5`.
GitHub Actions doesn't allow me to do that out of the box.
However, it's easy to run a shell command to do that.

```
    - name: Set Version Variable
      if: ${{ github.ref_type == 'tag' }}
      env:
        TAG: ${{ github.ref_name }}
      run: echo "VERSION=${TAG#v}" >> $GITHUB_ENV
```

This will set an environment variable VERSION equal to the current tag without the `v` in front.
It's a bit of a round about way to do it, but it works.

Using that VERSION environment variable, I can put the version number in the `dotnet pack` command and the `dotnet build` command.
This will update the assembly version and nuget package version to match.

```
dotnet build --no-restore /p:Version=$VERSION
dotnet pack --output nupkgs /p:PackageVersion=$VERSION
```

I set the VERSION variable to a default value in the workflow.
That way if the build isn't for a tag, it still runs with a valid version number.
In that instance the version number isn't as important as the build is just running as a CI validation build.

## Only Publishing on a Version Tag

My workflow will run pretty much anytime a commit is pushed to the repository.
So, I want to ensure it will only attempt to publish when the workflow is for a version tag.

This can be accomplished through an if condition checking properties on the GitHub context for the workflow run.
Both the step to set the version for a tag, and the step to publish the nuget package are gated by this check.

```yaml
- name: upload nuget package
  if: github.ref_type == 'tag' && startsWith(github.ref, 'refs/tags/v')
  run: dotnet nuget push nupkgs/*.nupkg -k ${{ secrets.NUGET_API_KEY }} -s https://api.nuget.org/v3/index.json
```

## Using Tags to Mark Versions in Git

I like to use tags for indicating versions for many reasons.

A tag points to a specific commit, and will not change.
A branch pointer, hand will move forward if someone were to commit to the branch.

Using tags leaves the branching policy open.
This is very useful in situations where a pre-release might be in a separate branch.
I can just tag a commit in the branch I'm working on with something like 'v1.0.0-prerelease' to have it publish.

It's straight forward to find what code was for a particular release.
Just look for the tag for the version.
Likewise, I can easily see the differences between versions by diffing the tags.

## Wrapping Up

Using GitHub Actions to publish a NuGet package makes this as easy as tagging a commit and pushing it to a repository.
While this process was written specifically for a GitHub Actions workflow, the same idea can be recycled in Azure DevOps, or GitLab.
I will be extending it in the future for a few additional use cases with the tags, but for now it is working fine for my purposes.

See the full workflow in the [GitHub repository](https://github.com/jerhon/hs-dependency-injection-source-generators/blob/main/.github/workflows/dotnet.yml).
