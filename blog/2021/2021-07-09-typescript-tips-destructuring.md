---
date: "2021-07-09"
title: "Typescript Tips: Destructuring Assignments"
tags: ["typescript", "tips"]
type: "blog"
description: "Destructuring objects in typescript."
---

Typescript has become my favorite language to use during web development.
Most of all, I love the type safety.
However, there are so many features to the language it's easy for little useful tidbits to get forgotten about.
I'm going to be writing some brief posts on some little features that have really been helpful during web development.

The first of these is destructuring assignments.

# Destructuring Arrays

For example:

```typescript
const [one, two, three] = ["one", "two", "three"]
```

While this is a trivial example, the opritunity here is to assign multiple values from an array at once.
This would be an alternative to this;

```typescript
const values = ["one", "two", "three"]
const one = values[0]
const two = values[1]
const three = values[2]
```

It simplifies and reduces the amount of code.

# Destructuring Objects

While it's useful for arrays in certain circumstances, it really shines with objects.

```typescript
const starfleetOfficer = { first: "William", last: "Riker", rank: "First Officer"}
const { first, last } = starfleetOfficer
```

This becomes even more useful in the case of functional react components, and in functions when an object is passed in and just a few values are needed.

```typescript

interface Person {
  firstName: string,
  lastName: string,
  address: string,
  phoneNumber: string,
}

function SayHello({ firstName }: Person) {
  console.log(`Hello ${firstName}.`)
}
```

While the examples are very contrived, they just show the main idea.

# Capturing Remaining Arguments

While I had known about destructuring assignments for a while, there was a little tidbit that I missed.
That was capturing the remaining arguments.
For example, in our previous example with arrays:

```typescript
const [one, ...remaining] = ["one", "two", "three"]
```

one will be "one", and remaining will be `["two", "three"]`.
And likewise with objects.

```typescript

interface Person {
  firstName: string,
  lastName: string,
  address: string,
  phoneNumber: string,
}

function SayHello({ firstName, ...remaining }: Person) {
  console.log(`Hello ${firstName}, ${remaining.lastName}.`)
}
```

In this case, `remaining` is an object that contains lastName, address, phoneNumber (the remaining properties from the person object)

# Wrapping Up

While it's not something that I will always use, destructuring assignments can tidy up code.
In certain contexts such as React development the end up being used very frequently.

I hope you find this tidbit useful.
Until the next tidbit, happy coding!
