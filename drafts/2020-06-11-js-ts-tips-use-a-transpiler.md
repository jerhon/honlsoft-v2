---
date: "2020-06-11"
title: "Javascript & Typescript Tips - #0 - Use a transpiler!"
tags: ["javascript", "tips", "web-development"]
type: "blog"
draft: true
---

A compiler is a common tool in software developer's utility belt, it's primary purpose is to take source code and covert it to a form which can be executed on a particular platform.  Perhaps this is as an application executable, library for reuse, or a binary form that can be understood by some interpreter.

A transpiler is a common tool that is used to take a language and process it into another language or a different version of the same language.  I'm going to give you the 

## A Transpiler Provides Easier Browser Compatibility

A great example of this is targeting compatibility for IE 11.  Even though it's market share is diminishing, you will still find plenty of businesses that need to to run, and make it absolutely required for a project.  Without a transpiler, you really only have one option.  That is to only use the javascript features available on IE 11 at the time.  The situation is even more complicated with the current state of web development. Maybe you can do this, but what about all the libraries you need to get your job done, have they done the same?

In short, IE 11 is going to be 7 years old this year, and the web and javascript have changed quite a bit in that time and introduced many new language features.  If you go ahead and use those new language features on IE 11, your code will fail, miserably.

Certain transpilers can help fill that gap, it takes javascript source finds new feature usage, and essentially replaces the code for the new features with code that is syntactically different, but semantically the same so that it can run on older browser such as IE 11.

## A Transpiler can Enhance the Language

Transpilers can also introduce new concepts into a language.  Typescript is a great example of this.  The debate of statically typed vs non-statically typed languages comes up all the time! I'm not going to get into that debate here.  Needless to say, there are folks on both side of the fence.  Javascript being a non-statically typed language and being the primary language of web development causes a lot of folks to cringe.

Full discloser: I prefer statically typed languages.

Typescript bridges that gap by providing static typing via typescript.  For example, you can define an interface or a class, specify that a parameter of a method must be of a certain type, etc.  Typescript is a superset of Javascript, thus any source written in javascript could be interpreted as typescript.  However, the other way around is not true.

## Transpilers to Consider

The two most common transpilers I've used are these.

* [Babel](https://babeljs.io/)
![Babel Page Screenshot](../images/babel-homepage.jpg)
* [Typescript](https://www.typescriptlang.org/)
![Typescript Page Screenshot](../images/typescript-homepage.jpg)

Babel works towards providing backwards compatibility to for older javascript versions.  Typescript, although compatible and similar to javascript, is really a different language.

Typically I use one of these in combination with a tool such as webpack to bundle and minify javascript libraries.  However, the discussion of bundling and minifying is something for a different post.

## Wrapping Up

A transpiler is an essential tool for developers.

Do you use a transpiler with your web development projects? If not, why not? If so, what other ways have you found transpilers useful?  Comment below or on the LinkedIn article.