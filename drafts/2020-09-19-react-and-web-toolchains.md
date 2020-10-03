---
date: "2020-10-02"
title: "React - Toolchains"
tags: ["react", "web-development"]
type: "blog"
---

Over the past month, I've been working on porting some old Angular JS applications to React as the end of life is coming up next summer.
I've been brushing up on my React, as the last time I really have written anything in React was in 2017-2018.
More recently, I've been working with Angular (not the old JS version).

React is much different than it was two years ago.
With the ability to use Hooks, it's become a lot easier to pick up.
However, one thing that is still lacking is an "official toolchain" to build a react application.
There is "Create React App". However, Create React App (CRA) has some very large pitfalls.

## Create React App

First off, CRA is very opinionated.
This is good and bad.
First off, if their presets work for a project, it is really simple to get a project off the ground.

However, once more complex web development scenarios come into play, and CRA doesn't do something, the only resort is to eject the application.  
For example, a project calls for some aliases with webpack to reference shared libraries on disk, or just to avoid the relative pathing fiasco in ES imports. Tough luck!
A common practice I've seen is someone will just use CRA to scaffold a build environment and eject right away.

This sole control over all the build tooling the project has put in place. It also doesn't provide a
way to share this configuration across projects. If there are 50 projects managed, it's potentially 50 different build configurations.

There have been some workarounds built with this in "customize-cra" and "react-app-rewired", CRA was never really built to handle those scenarios.
CRA is good for building out simple projects.

There are ways around this, but when I'm working on a substantial project, I want to make sure the toolchain can grow with me.
I don't want to get cornered in.

## Neutrino JS

Neutrino JS is a toolset I came across recently.
It's a configuration framework around web tooling.
It provides a way to build out reusable presets that can be used to scaffold projects.

It provides a simple command line which builds out an initial project.
Within the project it contains a javascript file which controls the actual project.

## Other Alternatives

Up to this point, I've trying to stick with webpack.
It's one of the most popular web bundlers out there today.

There are other alternatives
