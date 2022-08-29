---
date: "2021-07-20"
title: "Typescript Tips: null(and undefined) Checking"
tags: ["Typescript"]
type: "blog"
description: "Various operators for dealing with null in Typescript."
---

Null is often described as the million dollar problem or billion dollar mistake.
There are so many times when a null check is needed in code that it can be easy to forget them.
Javascript compounds this with the additional special case of undefined.

With Typescript, strong typing helps catch these errors.
However, in Typescript that safety comes with the added complexity of having to do null checks a lot.
Thankfully, in Typescript, there are several shorthand ways to deal with nulls.

# The Elvis Operator

The Elvis operator is a shorthand way to check for null or undefined without requiring a separate if statement.
It looks something like this in practice.

```typescript
console.log(obj?.hello) // logs null if the obj is null, and does not reference hello
```

Well this is a simple case, some more uncommon ones I don't often see samples for are arrays and function calls.
What if I want to access an object as an array, but it could be null or undefined?

```typescript
console.log(obj?.[0]) // logs null, and does not evalute the array
```

This will only evaluate the array when it is not null or undefined.
How about a function call? 
Assuming a type definition of `null | () => void` for the function.

```typescript
obj?.call(null); // logs null, and does not call the function
```

Why is this called the Elvis operator?
Well if you kind of look at the right way, it supposedly looks like Elvis (with his little curl in his hair).

# The Null Coalescing Operator

The other useful operator is the null coalescing operator.
When a value can be undefined or null `??` can be used to supply an alternate value.
A very common use case is to use an alternate default for null or undefined.

```typescript
console.log(null ?? "hello")
// Outputs: hello

console.log(undefined ?? "hello")
// Outputs: hello

console.log("world" ?? "hello")
// Outputs: world

console.log("" ?? "hello")
// Outputs: ""

console.log(0 ?? "hello")
// Outputs: 0
```

The huge difference here is it is just checking for null or undefined.
In the past the || operator was commonly used.
However, that worked differently on falsy values.
So, the "" and 0 case behave differently as they are considered falsy.

```typescript
console.log(null || "hello")
// Outputs: hello

console.log(undefined || "hello")
// Outputs: hello

console.log("world" || "hello")
// Outputs: world

console.log("" || "hello")
// Outputs: hello

console.log(0 || "hello")
// Outputs: hello
```

# Wrapping Up

If you've been using Typescript for some time you'll likely have come across both of these ways to deal with nulls.
However, the examples above around calling a function and array access weren't as easy to find.
So, I hope you'll find this helpful.
