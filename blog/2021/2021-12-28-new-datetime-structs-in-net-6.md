---
date: "2021-12-28"
title: "New DateOnly and TimeOnly Types in .NET 6"
tags: ["dotnet6", "DateOnly", "TimeOnly"]
type: "blog"
description: "Using the new DateOnly and TimeOnly structs in C#"
---

I keep finding new little gems in .NET 6.
The latest was the DateOnly and TimeOnly structs in .NET 6.

Previous to .NET 6, time was typically represented as a DateTime, a DateTimeOffset, or sometimes a TimeSpan for intervals.
DateTime and DateTimeOffset worked, but there are odd situations where you need to represent just a Time or just a Date.
Trying to represent a Time in a DateTime can lead to all kinds of odd situations.

Is one DateTime UTC vs Local, etc?
What if I just need to do time comparisions, what do I do with the date?
What if I don't know the time zone, but what "Kind" of DateTime should I use?
The questions abound rather quickly.

Enter the DateOnly and TimeOnly structs.

## Examples - DateOnly

If you've used the DateTime type at all, much of this will look similar.

```csharp

// Parse, also TryParse & TryParseExact is implemented
var date = DateOnly.Parse("2021-12-28");
var today = DateOnly.FromDateTime(DateTime.Now);

// Addition Methods
date.AddYears(1);
date.AddMonths(1);
date.AddDays(1);


// Operator Overloads

var date2 = DateOnly.Parse("2022-12-29);
if (date2 < date) {
    Console.Log("You're early...")
}
if (date2 > date) {
    Console.Log("Your'e late...")
}

```

Here's a link to the reference documentation: [.NET 6 DateOnly Reference](https://docs.microsoft.com/en-us/dotnet/api/system.dateonly?view=net-6.0)

## Examples - TimeOnly

Again, this should all be vaguely similar to DateTime.

```csharp

var earlyMorning = TimeOnly.Parse("1:00AM");
var timeToWakeup = new TimeOnly(7, 0);
var sleepingTime = new TimeOnly(5, 0, 0);

if (sleepingTime.IsBetween(earlyMorning, timeToWakeup)) {
    Console.Log("Time to sleep!")
}

// Addition
sleepingTime.AddHours(1);
sleepingTime.AddMinutes(1);
sleepingTime.AddSeconds(1);

// Or operators which subtraction resolves to a TimeSpan
var timeSpan = timeToWakeup - earlyMorning;
Console.Log(timeSpan.ToString()) // 06:00:00
```

Here's a link to the reference documentation: [.NET 6 TimeOnly Reference](https://docs.microsoft.com/en-us/dotnet/api/system.timeonly?view=net-6.0)

## Wrapping Up

While this isn't revolutionary, it does make working with Dates and Times easier.
I haven't gone through everything that's possible with these new Types, check out the documentation for a complete list of what methods are available.

Again, it's just another one of those little changes in .NET 6 that will be useful.
