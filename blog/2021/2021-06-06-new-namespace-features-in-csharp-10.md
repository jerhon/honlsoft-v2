---
date: "2021-06-06"
title: "New Namespace Features in C# 10"
tags: ["C#", ".NET"]
type: "blog"
description: "Describes a few of the new changes in C# 10 related to namespaces."
---

With .NET 6 arriving this fall, there are a wealth of new features being introduced that I'm really excited about.
With most new .NET versions come new features added to the C# language.

As part of this article, I'm going to pick out a few of my favorites being introduced in C# 10 related to namespaces that I'll use often.

Keep in mind, .NET 6 is still in preview, so it's always possible they could get cut or changed in the final release.
However, I've seen them demoed by various folks at Microsoft.
So, I would be shocked if they don't make the final cut.

# File Scoped Namespace

Namespaces work to scope and organize .NET classes, interfaces, and other language constructs.
Here's a simple example.

```csharp
namespace Honlsoft
{
    public class ClassIsScopedInANamespace {
      // ... Some class implementation
    }
}
```

To reference the ClassIsScopedInANamespace, I either need to import the `Honlsoft` namespace via a `using` statement or, reference the fully qualified name such as `Honlsoft.ClassIsScopedInANamespace`.
This is very common.
Many languages have a similar construct.
Java has packages.
Javascript now has ES modules.
This list could go on.

However, in other languages such as Java, the declaration is just a one liner at the top of a file.
No curly braces are required.

The curly braces in C# introduce another level of indentation in a C# program.
For really little benefit.
I rarely see anyone define more than one namespace in a single file.

The new syntax in C# 10 allows ditching the block.
It becomes similar to package definition syntax in Java.

```csharp
namespace Honlsoft;

public class ClassIsScopedInANamespace {
    // ... Some class implementation.
}
```

Honestly, it's going to take me a while to get used to not having the indentation, but I'm all for reducing needless code nesting.

# Global Usings

One of the annoyances of namespaces is having a seemingly boundless number of using statements that are needed at the top of a file.
For example.

```csharp
using System;
using System.Linq;
using System.Text;
```

This gets worse once we use a specific technology with a lot of namespaces such as ASP.Net Core. 
While SOLID code tends to reduce the number of using statements in a single file, it seems like there are those pesky ones that make it to the top of nearly every C# file.

Starting with C# 10, some of this pain will go away.
`using` statements can be declared as global for a .NET project.
I would never need to include one of those in a specific file again.

```csharp
global using System;
global using System.Linq;
global using System.Text;
```

A pattern suggested pattern with this feature is in every project having a `GlobalUsings.cs` that outlines the global usings in the project.

# Wrapping Up

These are just two features in C# 10 I'm looking forward to when it is released this fall.
They are small changes, but they will be used ubiquitously throughout code.
I really like when the C# team focuses on these small things to make the language more concise.
