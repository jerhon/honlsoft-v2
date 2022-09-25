---
date: "2022-09-20"
title: "Creating a Custom Javascript GitHub Action"
tags: ["GitHub Actions", "Javascript"]
type: "blog"
description: "How to publish a NuGet package through GitGub Actions."
---

GitHub Actions is a great platform to automate builds.
However, it's inevitable that eventually there will be things the platform just won't do out of the box.

For example, in a previous post I wrote on publishing a nuget package through GitHub Actions, I had to resort to a bash script to extract the version number from a Git tag to later use in my automation.
The bash script worked, great, but for reusability purposes, I'd have to copy that same bash snippet around.

