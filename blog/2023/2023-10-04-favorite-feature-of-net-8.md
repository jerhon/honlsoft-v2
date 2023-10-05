---
date: "2023-10-04"
title: ".NET 8: My Favorite Feature"
tags: [".NET 8", "Primary Constructors"]
type: "blog"
description: "Primary constructors in C# 12"
---

It's getting close to November, and that means a new .NET release is about to be released.
While there are a lot of features that deserve attention, there is one feature that is one of my favorites as it's going to reduce the amount of code I need to write.

That feature is primary constructors.
It's a new feature in C# 12 that reduces the amount of code needed for simple constructors.


## A Code Sample Without Primary Constructors

We'll look at an example of the chess program I've been writting off and on for the past few months.

I have a class which I use to define the rules of a chess game.

It takes a chessboard and determines whether certain moves are valid, the state of the game, whether the king is in check, etc.

Some of this logic I divided up into a pattern where I can define the valid moves for each individual piece.
Each of these is defined by implementing a class from IMoveRule.

The GameRules class is using dependency injection (DI).
Rather than constructing all the IMoveRules objects itself, those rules are given to the GameRules via the constructor.
In this case we can see that all the constructor is doing is assigning its dependencies to a private field.

```
public class GameRules {

    private readonly IEnumerable<IMoveRule> _moveRules;

    public GameRules(IEnumerable<IMoveRule> moveRules) {
        _moveRules = moveRules;
    }

    // ... more code ...
}
```

When using dependency injection there is typically a lot of boilerplate code in constructors like this.
Take in a value, assign it to a field to be accessed later in the class.

## Modifying the Code to use Primary Constructors

Primary constructors eliminate much of this boilerplate.
It is now possible to write that same code in fewer lines:

```csharp
public class GameRules(IEnumerable<IMoveRule> moveRules) {
    
    // ... more code ...
}
```

The move rules are now accessible throughout the class via the field moveRules.
It has taken away the need to manually create a field and assign to it.

This may seem like a small change, but a class with several parameters can start to have constructors that are longer with many more fields to sign.

## Wrapping Up

This may seem like a super simple change.
However, with the pervasiveness of dependency injection in modern .NET this is much welcome change that will make it much easier to use DI.

I'm looking forward to the .NET 8 release, and getting to clean up my code with this new C# feature.
