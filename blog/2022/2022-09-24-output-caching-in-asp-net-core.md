---
date: "2022-09-24"
title: "Output Caching in .NET 7 with ASP.Net Core"
tags: [".NET", "ASP.Net Core", "Output Caching", ".NET 7"]
type: "blog"
description: "Simple examples around output caching in .NET 7 with ASP.Net Core."
---

The release of .NET 7 is around the corner with it now in RC.
There are several new features that have grabbed my attention that I decided to try out.

The first of these is Output Caching in ASP.Net Core 7.

## What is Output Caching?

Output caching stores the response of an ASP.Net endpoint based on a policy so that it will not be re-calculated on a future request.

This is different from Response Caching previously in ASP.Net Core.
Response used cache headers and responses from endpoints to determine whether the server should return a cached response or not.
This required using HTTP headers such as etag, Last-Modified, If-Not-Modified headers to control the cache.

In short - Response Caching is controlled by the client and server, and Output Caching is controlled purely by the server.
Even if a client passes headers to not cache content, the endpoint will serve up a cached version of its response.

Output caching can improve performance by reducing the load on an API.
It can also speed up user experiences as data can be served from memory or a centralized cache instead of having to make round trips to a resource such as a database every time an API is requested.

## The Base Application

One of the great features of .NET 6 was the simplification of building small focused API based applications.
So I can have a single file which contains the entire code for a simple API application.

My base application will look like this:

```csharp
var builder = WebApplication.CreateBuilder(args);

var thirtySecondCachePolicy = "thirtySeconds";

// Add services to the container.
builder.Services.AddOutputCache((opts) => {
    opts.AddPolicy(thirtySecondCachePolicy, (policy) => policy.Expire(TimeSpan.FromSeconds(30)));
});

var app = builder.Build();

app.UseOutputCache();

// Return a cached time
app.MapGet("/time", () => TimeOnly.FromDateTime(DateTime.Now).ToLongTimeString())
    .CacheOutput(thirtySecondCachePolicy);

app.Run();
```

I will be using the [HTTP repl](https://learn.microsoft.com/en-us/aspnet/core/web-api/http-repl/?view=aspnetcore-6.0&tabs=windows) to test out the various options on output caching.
In the traces from HTTP repl I have removed some of the HTTP headers to make the traces easier to understand.


Some of my examples may be a bit contrieved, but the goal here is to understand what I can do so I can apply it in real world situations when it makes sense.
My goal is not to recreate the real world situations themselves.

## Time Based Output Caching

This is the simplest.  Cache the output for 30 seconds, then let the endpoint process again on the next request and again cache that response for 30 seconds.
This use case was already included in my original sample code.

I call the API endpoint a few times seconds apart, and I get the same response even though the time has changed.
I call the API endpoint a minute later, and it is no longer that cached response..

```
http://localhost:5199/> GET /time
HTTP/1.1 200 OK
...

10:15:25


http://localhost:5199/> GET /time
HTTP/1.1 200 OK
Age: 7
...

10:15:25


http://localhost:5199/> GET /time
HTTP/1.1 200 OK
...

10:16:36
```

One easy way to tell if the ouput is cached is based on the Age header.
The Age header informs as to how old the response is.
If that is not present, for the purposes of this article, the response was not from the cache.

## Condition Based Output Caching

Here I'm going to set up the API to cache only when a query string of "cache" with a value of "yes" is included.

The code for the policy looks like this:

```csharp
    opts.AddPolicy(conditionalCache, (policy) => policy.With((ctx) => ctx.HttpContext.Request.Query["cache"] == "yes"));
```

The code for the response endpoint likes similar to the previous, the cache policy is just altered on this endpoint:

```csharp
app.MapGet("/conditional_time", () => TimeOnly.FromDateTime(DateTime.Now).ToLongTimeString())
    .CacheOutput(conditionalCache);
```

I make five requests.

* One without cache
* Two with the cache
* Another without the cache
* A final request from the cache.

As expected, all the requests with ?cache=yes come back with the same response.
The others with the ?cache=no retrieve fresh data.

```
http://localhost:5199/> GET /conditional_time?cache=no
HTTP/1.1 200 OK
...

15:07:05


http://localhost:5199/> GET /conditional_time?cache=yes
HTTP/1.1 200 OK
...
15:07:08


http://localhost:5199/> GET /conditional_time?cache=yes
HTTP/1.1 200 OK
Age: 2
...

15:07:08


http://localhost:5199/> GET /conditional_time?cache=no 
HTTP/1.1 200 OK
...

15:07:14


http://localhost:5199/> GET /conditional_time?cache=yes
HTTP/1.1 200 OK
Age: 8
...

15:07:08
```

## Cache Based With Route Parameters

I'm going to create an endpoint with the route "/Person/{name}" where name is a parameter in the endpoint.
The code will print the name and the time.

The code looks like this:

```csharp
var currentTime = () => TimeOnly.FromDateTime(DateTime.Now).ToLongTimeString();

app.MapGet("/person/{name}", (String name) => $"Hello, {name} @ {currentTime()}.")
    .CacheOutput();
```

Now, I'll make two requests for Picard and Crusher.

```
http://localhost:5199/> GET /person/Picard
HTTP/1.1 200 OK
...

Hello, Picard @ 15:29:27


http://localhost:5199/> GET /person/Picard
HTTP/1.1 200 OK
Age: 3
...

Hello, Picard @ 15:29:27


http://localhost:5199/> GET /person/Crusher
HTTP/1.1 200 OK
...

Hello, Crusher @ 15:29:36


http://localhost:5199/> GET /person/Crusher
HTTP/1.1 200 OK
Age: 2
...

Hello, Crusher @ 15:29:36
```

As you can see, even with the route parameter, it is caching the return separately.

## Tags and Programmatically Clearing the Cache

The final example I want to show are tags.
This allows identifying items in the cache.
In this case, I'm going to tag an endpoint with a generic tag of "Tag".
I'll have another endpoint that clears the cache for any entries associated with that "Tag".

```csharp
opts.AddPolicy(taggedCache, (policy) => policy.Tag("Tag"));
```

The code for the endpoints:

```csharp
app.MapGet("/tagged_cache", currentTime)
    .CacheOutput(taggedCache);

app.MapPost("/tagged_cache/clear", async (IOutputCacheStore cacheStorage, CancellationToken cancelToken) => {
    await cacheStorage.EvictByTagAsync("Tag", cancelToken);
    return $"Cleared Cache @ {currentTime()}";
});
```

I'll make two requests to the `/tagged_cache` endpoint.
The second will return the cached values.

I will clear the cache through a post request, and make two additional requests.
We'll see a fresh response followed by a cached response.

As in my previous examples, I'll wait a little bit between requests so we can watch the Age header.

```
http://localhost:5199/> GET /tagged_cache
HTTP/1.1 200 OK
...

17:03:59


http://localhost:5199/> GET /tagged_cache
HTTP/1.1 200 OK
Age: 4
...

17:03:59


http://localhost:5199/> POST /tagged_cache/clear --no-body
HTTP/1.1 200 OK
...

Cleared Cache @ 17:04:07


http://localhost:5199/> GET /tagged_cache
HTTP/1.1 200 OK
...

17:04:10


http://localhost:5199/> GET /tagged_cache
HTTP/1.1 200 OK
Age: 5
...

17:04:10

```

It worked as expected.
According to the trace,  I was able to evict the entries on demand by a tag, and have a new entry cached and returned on subsequent requests.

## Reasons Not to Use Output Caching

Caching can be a great way to improve performance of an API, and when working in distributed architectures can improve performance.
However, there are downfalls as well.

If the API is an API that returns different data per user, extra care needs to be taken to ensure user specific data isn't returned to the wrong user.
The .Vary* methods on the policy can be used to ensure responses are varried based on the http request.
One option would be to vary based on a user ID after the request has made it through the Authentication and Authorization middleware.
However, if there are a large amount of users with a lot of data to cache, that may not be the best solution.
Every decision has tradeoffs, and it's best to fit caching to your specific solution.

Another consideration is based on the endpoints themselves, it may be necessary to have a consistent cache across multiple servers.
It is possible to swap out the IOutputCacheStore to use a centralized cache, but that's beyond the scope of this article.
I was unable to find any additional implementations of the cache storage yet.
However, since this is unreleased functionality at the time of this post, I'm not supprised.

It may be that more coordination is needed between the caching of data and evicting the data from the cache.
For example, if cache invalidation is required on write.

There are other considerations to take into account as well, but for basic use cases the output caching should work fine.

## Wrapping Up

These were some very basic use cases for output caching, but just enough to get me started to think about what's available.
I can already think of use cases I've had in the recent past that the output cache would greatly improve end user performance.

Again, with a new version of .NET, there's a lot of great new functionality.
I'll write a few more articles in the coming months on features I'm looking forward to in .NET 7.

[See the full source on GitHub.](https://github.com/jerhon/net-7-output-cache-samples)
