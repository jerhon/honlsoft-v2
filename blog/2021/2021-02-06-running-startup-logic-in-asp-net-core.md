---
date: "2021-02-06"
title: "Running Startup Logic in ASP.Net Core Applications"
tags: ["dotnet", "asp-net-core", "web-development", "covid-dot-net-core"]
type: "blog"
description: "Shows how to run startup logic in an ASP.Net Core application."
---

In web applications, it can be necessary to have tasks that run on start up of an application.
In older ASP.Net, this was not as clear cut how to accomplish. 
In ASP.Net Core there is a clear pattern established through the IHostedService interface to make this a breeze.

As part of my [COVID-19 application](https://www.honlsoft.com/projects/covid-19-application-v3/), I had to create a few of these hosted services.

For example, I had to set up my database prior to the application actually running.
As this application is utilizing an in-memory database, there are no concerns about it running multiple times, or needing migrations when things change.
On my EF Context, I simply have to call .EnsureCreatedAsync to make sure the database is initialized.

Wiring this up is a simple process.
* Implement the IHostedService interface
* Add the implementation to the application through an AddHostedService call

## Implementing the IHostedService

Here is my IHostedService.
There are two methods here.
One on Startup to perform a functionality.
Assuming a graceful shutdown, one on Shutdown to call any functionality to clean up.

In this case in StartAsync, I'm simply calling the logic to set up the database.
Note also how I can obtain services via DI in the constructor to grab the IDbContextFactory for my EF Core data context.

```csharp
public class CovidDataContextInitializationService : IHostedService
{
    private readonly IDbContextFactory<CovidDataContext> _factory;
    
    public CovidDataContextInitializationService(IDbContextFactory<CovidDataContext> factory)
    {
        _factory = factory;
    }
    
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await using var context = _factory.CreateDbContext();
        await context.Database.EnsureCreatedAsync(cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
```

## Setting up the IHostedService to Run

In my Startup class, in ConfigureServices, I just add the hosted service with the AddHostedService call.
If utilizing multiple services, the services should run in order that they are added to the DI container.
This will also be run prior to the ASP.Net core application starting and wait for completion of the returned Task.
This ensures that the resources can be initialized before taking any requests.

```csharp
services.AddHostedService<CovidDataContextInitializationService>();
```

## Wrapping Up

I love how many tasks that .NET Core and ASP.NET Core have simplified and drive developer efficiency.
This snippet in particular is self-contained and easy to re-use in similar instances.
I remember in many .NET Framework applications having to manually code this pattern.

There are many other ways this can be used as well. This can facilitate patterns such as:
* Running scheduled tasks
* Using specific tasks for clean up
* Hosting long-running background services 

Read more about the pattern in the [ASP.NET Core documentation.](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/host/hosted-services)
