---
date: "2020-10-02"
title: "Detecting Elements on Screen with Intersection Observer"
tags: ["web-development", "css", "css-transitions"]
type: "blog"
---

Ever wanted to animate an HTML element as it becomes visible on a webpage?
Me too.
Often, I've seen others make cool animations that trigger when scrolled into view on a website page.
For example, sliding text in from the right when the page scrolls in, or making text fade in when it scrolls into view.

For quite some time this involved hooking into various DOM events, finding the position of an element relative to the viewport and performing comparisons to determine if it were visible.
It was doable, but complicated.
It was best to rely on some framework to perform the logic rather than a 'roll your own' approach.

Recently, this has become much easier to perform with the introduction of the Intersection Observer.

## Intersection Observer

The [Intersection Observer](https://w3c.github.io/IntersectionObserver/) is an event based model for checking when two DOM elements intersect, or when an item becomes visible in the viewport.
Setting it up requires creating a new Intersection Observer object providing a callback for intersection events, and options about how the intersection should be determined.

I've created an example in a CodePen to illustrate its usage.
Scroll down, and you'll see text fade in and move in from the right on the page.

https://codepen.io/jerhon/pen/oNxQgvP

To watch for items entering the viewport, create a new IntersectionObserver object providing a callback.
Call the observe method on one or more DOM elements.
The callback will be called whenever an intersection is detected, or a threshold has changed.
The callback includes an array of events with each event holding an element where the intersection has changed.
Simply use that to modify the element, add a CSS class to it, etc.

## Thresholds and the rootMargin

In the options there are a few things to configure.
Thresholds, and the rootMargin are the most interessting.

The rootMargin provides a way to modify the main intersection object.
For example, if you wanted to only start an animation if the item is 50px into the viewport to delay the animation a bit, the rootMargin would allow this.
I find it best to use heights relative to the viewport such as 5vh for 5% of the vertical height rather than specific pixel values.
The rootMargin is an option supplied in the options object as the second parameter of the constructor.

Thresholds are a ratio for how much of the object overlaps.
For example, if you specify a threshold of 0.5, when 50% of the element overlaps the event is triggered.
Again this can be supplied in the second parameter of the InteractionObserver.
The other interesting thing is that you can specify potentially multiple thresholds and get events when each one is crossed.

## Beware Leaks

The Intersection Observer will not be destroyed until there are no references to it in the application AND it is observering no elements.
This really isn't a problem, just be aware there is extra cleanup to do to prevent objects leaking in the browser.

## Browser Compatability

The Intersection Observer is still a Working Draft, which means it is potentially subject to change.
However, it has already been implemented in most current major browsers.
Internet Explorer is the obvious exception to that.
There is a poly fill for browsers that do not support it yet as part of the [GitHub repo](https://github.com/w3c/IntersectionObserver/tree/master/polyfill).
This is also saved as an NPM package which makes it easy to import

## Wrapping Up

Again, it's a just a little touch that can be added to a website to spruce it up.
Making transitions interactive through scrolling can add that little extra to make a website feel more alive.

If you want to see some more examples in action, you can see them on the https://www.honlsoft.com website.
A few of the images have text over them that fades in, and I have some text that fades in from the right later on.
