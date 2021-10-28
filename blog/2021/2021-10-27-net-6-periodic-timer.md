---
date: "2021-10-27"
title: "New Periodic Timer API in .NET 6"
tags: ["csharp10", "dotnet6", "PeriodicTimer"]
type: "blog"
description: "Using the new Timer API in .NET 6"
---

The GA of .NET 6 is right around the corner, I've posted some articles in the past about upcoming changes I'm looking forward to.
While there are a lot of major improvements that get a lot of attention, many of the smaller improvements get pushed to the wayside.

One small change that I really like is the new PeriodicTimer class.

Previously Timers in .NET revolved around a callback interface.
System.Timers.Timer had a event which an event handler could be added that would be invoked every time the timer was to go off.
System.Threading.Timer had a class which would register a callback as part of the constructor.
Both worked, but had their drawbacks.

With the callback based timers, if an error occurs in the callback extra work is required to ensure the timer is shutdown.
Using the PeriodicTimer, exceptions flow as normal.
The other concern with the callback based timers is overlapping calls, if processing hasn't finished prior to the next timer tick.
For the PeriodicTime this isn't such an issue since there is really only a single execution flow with the async code.

## The PeriodicTimer

The PeriodicTimer uses an asynchronous approach based on the System.Threading.Tasks.
It has a method WaitForNextTickAsync that 'await'ed in order to pause execution until the next time the timer is elapsed.
This is easiest to see in a simple code snippet.

## Example

The easiest way to see this is by example.
I'm going to set up a PeriodicTimer that outputs a message every second.
I'll use a Stopwatch to keep time to see how often the callback executes.
I'll also add a 500 millisecond delay in the loop.
This is there to show that the loop still runs once every second ( as opposed to every second + 500 millseconds ).

```C#
using System.Diagnostics;

using var timer = new PeriodicTimer(TimeSpan.FromSeconds(1));
Stopwatch sw = Stopwatch.StartNew();
while (await timer.WaitForNextTickAsync())
{
    Console.WriteLine($"Elapsed time: {sw.ElapsedMilliseconds}ms");
    await Task.Delay(500);
}
```

As expected, the sample outputs this.

```
Elapsed time: 1009ms
Elapsed time: 2005ms
Elapsed time: 3003ms
Elapsed time: 4001ms
Elapsed time: 5015ms
Elapsed time: 6004ms
Elapsed time: 7008ms
Elapsed time: 8009ms
Elapsed time: 9004ms
Elapsed time: 10010ms
```


## Wrapping Up

There are quite a few of these little gems in .NET 6.
The PeriodicTimer is one of those small base classes that I'm sure I'll be using in the future.
