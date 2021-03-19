---
date: "2021-03-13"
title: "My Favorite C# 9 Feature - Records"
tags: ["c#9"]
type: "blog"
description: "C#9 and records are a great way to reduce the number of 'Plain Old Objects' that need to be written."
---

A common pattern in software development is the "Plain Old Object".
They are ubiquitous in statically typed languages.
DTOs, API contracts, configuration objects, serialization code typically use "Plain Old Objects".

An extremely simple example would be a class like this in C#:

```CSharp
public class Person {
    public Person(string firstName, string lastName) {
        FirstName = firstName;
        LastName = lastName;
    }

    public string FirstName { get; private set; }
    public string LastName { get; private set; }

    /* ... you get the idea */
  
    /* ... but what about Equals(), GetHashCode(), etc? */
} 
```

The problem isn't limited to .NET or C# either.
In statically typed languages such as Java, code is littered with these.

In C#9, released with .NET 5, Microsoft has introduced records to make these classes easier to implement.

Here's a very simple example:

```CSharp
public record Person(string FirstName, string LastName);
```

That is all I need to create the Person class from earlier.

The ```record``` keyword adds a lot of extra niceties on top of this.
The class has an Equals() implementation that performs comparison on the fields similar to a struct rather than a class-- including all the other necessary plumbing to get it done such as the GetHashCode implementation.
It provides a ToString() implementation that prints properties.
It implements the Deconstruct method for easily using it with Tuples.
Records are also immutable-- the properties cannot be set after the object has been instantiated.

I'm not even including all the benefits here.
This would all be code that typically someone would have to manually write.
While the savings may seem small for an individual class, remember these are used everywhere.
The time saved is easily compounded.

## Wrapping Up

While C#9 has introduced quite a few new great features, the ```record``` keyword  is by far my favorite.
It greatly reduces the number of lines of codes I need to write and maintain.
This gives me more time to focus on business logic instead of needless plumbing.

I love these types of efficiencies in newer versions of the C# language.
