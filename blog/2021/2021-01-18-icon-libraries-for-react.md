---
date: "2021-01-18"
title: "Icon Libraries in React"
tags: ["react", "web-development"]
type: "blog"
description: "Using react-icons as an Icon Library for React"
---

Part of the look and feel of building a web application is determining what icons to use.
There are so many great standalone icon libraries available today.
Many of the design languages even offer their own icon libraries.

It can be daunting looking through all these libraries and picking those icons you feel fit best for your site.
If you're using React, there is an AWESOME package that provides a large set of SVG based icons to use.

[react-icons](https://react-icons.github.io/react-icons)

This is a great package as it allows picking icons from a particular icon library without having to bring them all in.
I can take a "pick the best of the best" approach and combine multiple icons from different icon sets.
Since it also provides a NPM single package for many icon sets.
I don't have to go hunting for them. For example: how does material import vs how does react-bootstrap? 

If you're using a bundler, they can be set up so that only the icons you use get bundled with the application.
This can reduce the overall size of your site.

My general guidance is: 
When using a UI library that has an icon set, I recommend using their built-in icons.
However, when presented a scenario with a gap needs to be filled, "react-icons" does so wonderfully.

I built a small codepen that shows how easy these are to use in React.
It's really just a single import to use the Icon.

https://codepen.io/jerhon/pen/YzGBvWv


