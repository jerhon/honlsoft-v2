---
date: "2022-03-26"
title: "Reading Reference Data in .NET Unit Tests"
tags: ["unit-testing"]
type: "blog"
description: "A quick trick on how to easily read reference data for a test."
---

When I'm unit testing in .NET many times I need a very large string or set of data to provide as input to a test case or as a final insertion.
I like to use XUnit, but there aren't a lot of clear options to do this in any unit testing framework.

One way to do this is to just store the large amount of data in a file somewhere near the test it's self.
Common options to reference this file are around finding the test assembly DLL, making sure the files are copied to the output.
Or another common scenario is to embed test files in the assemblies themselves as resources.
While both are functional, they present challenges in certain situations and can be tricky to set up properly.

I've recently devised a little trick around some compiler related attributes to make this easier.
This has been so useful to me I wanted to share it on my blog.

## Locating Test Data Using the CallerFilePathAttribute

Here's a recent situation where I wanted to be able to reference data directly from a file rather than in code.
I have a strongly typed Client class to build for an application by hand, and as a result I have a lot of JSON data that I need to verify the Client deserializes properly.
Keeping all that JSON data in code is a pain as I have to escape it all, and it makes my source files HUGE as the JSON data can go on for lines and lines.

So, I keep the data in a separate file, and use the `CallerFilePathAttribute` to locate it.
Here's a snippet of code that shows this:

```csharp
public static class TestFileUtils {
    public static string ReadFileAsString(string file, [CallerFilePath]string filePath = "") {
        var directoryPath = Path.GetDirectoryName(filePath);
        var fullPath = Path.Join(directoryPath, file);
        return File.ReadAllText(fullPath);
    }
}
```

The `[CallerFilePath]` attribute will resolve the path of the source file from the caller when the application is run.
This works because the C# compiler will take and replace this with the actual file path at compile time.
Let's say I have a test file in a directory with a file name of `ClientTests.cs` and a `Response1.json` sitting alongside of it: 

```
tests\
    - ClientTests.cs
    - Response1.json
```

I can easily get at the `Response1.json` by calling `TestFileUtils.ReadFileAsString("Response1.json")` from the file `ClientTests.cs`
This will locate the `Response1.json` since it's sitting alongside the code file, and read the contents of the file as a string.

In environments where the source code is not available, like running on a remote test runner, this will not work.
However, for simple unit tests where the tests are compiled and run on the same machine with access to the original source, this really is no problem.
That is the case the vast majority of the time for me.

## Wrapping Up

This trick was too great not to share.
It's my goto way to read in file data for simple testing scenarios.

Keeping large sets of testing data separate from the tests themselves makes the tests more readable, and avoids having to deal with lots of string escaping in code files.
Using this method, it makes it easy to reference that testing data. 
