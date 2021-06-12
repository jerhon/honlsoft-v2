---
date: "2021-06-11"
title: "Minimal APIs in .NET Core 6"
tags: ["csharp10", "dotnet6", "aspnetcore"]
type: "blog"
description: "The Minimal API Scaffolding in ASP.Net Core 6"
---

One thing I've been jealous of scripting languages over the years is how easily they can be used to build out small and simple applications.
For example, Node.js has the express library whereby a complete API can be built out in a single file.
While more complex projects necessitate more framework than that, the required scaffolding for a simple program was fairly low.

In languages such as C#, prior to .NET 6, to build out a simple API requires some degree of pomp and circumstance.
It required setting up an MVC application with a WebApplication and Controller.
Also setting up the pattern required an entry class like Program with a Main method, and a Startup class to configure the web application.
It wasn't difficult, but it likely could be more simple.

Enter ASP.Net Core 6...

# Asp.NET Core 6 and the New Empty Project Template


With Asp.NET Core 6 and the C# enhancements that have been introduced between C#9 and C#10, a lot of boiler plate code has been removed.
It's now possible to write a simple program in .NET that hosts an API in .NET in a single file.

The latest boilerplate for an empty ASP.Net Core application in .NET 6 Preview 4 looks close to this.
(I added in the record, a C#9 feature, to show how easy it is to build out a DTO structure for a simple API.)


```csharp
using System;
using Microsoft.AspNetCore.Builder;

var builder = WebApplication.CreateBuilder(args);
await using var app = builder.Build();

app.MapGet("/", (Func<GreetingDto>)(() => new GreetingDto("Hello, world!")));

await app.RunAsync();

record GreetingDto(string Greeting);
```

This really is just a simpler and less verbose way to write an API in .NET 6.
While I haven't measured the performance personally, the .NET team is claiming building a simple API through this mechanism achieves better API throughput.

The thing I really like about the above example is it feels more straight forward how and what is being called to configure the web application.
With the Startup class in previous version of .NET there was a bevy of Configure* methods on it that seemed to be called magically when the application started.
Whereas the startup here is really imperative.
I control the builder pattern and tell it what to configure, and it's very clear when I configure it.

I've lost the MVC features, but there is still access to a lot of the other things I'm expecting.
I can still use DI container, the app configuration, logging,... through the built out app.
I can use `builder.Services` to access and add to the service collection.
I can call any number of the `.Use*` extension methods on the Web Application app to configure the Http pipeline.
That includes wiring in Mvc with the `.UseMvc` method on the app object here.

However, while this works for smaller applications that just need to do a few things, in large applications, I don't think WebAPI and MVC should be discounted.
MVC still provides a good pattern that can very sensibly divide up an application domain.
While it could be split out into separate files, all defined through this Map could very easily grow out of control.
MVC already handles dealing with organizing large API sets really well.
Additionally, there are good frameworks such as those to provide API documentation out of the MVC framework through the OpenAPI specification.

# Wrapping Up
While I'm not sure all applications I build will use the Map pattern above, the ability to build a simple HTTP based API in a single file really makes .NET compete in a space where only scripting languages were before.
The thought here is really just to show what's capable rather than to state "This is the way."
The ability to take a simple idea and write a simple .NET program without all the extra scaffolding will have targeted use cases.

The pattern will be optimized further in future previews of .NET 6 as well.
The .NET team has indicated one of the language features will be reducing the need to cast delegates such as the (Func<string>) in the code above.
The lambda can be specified, and the compiler will be able to infer its type.
