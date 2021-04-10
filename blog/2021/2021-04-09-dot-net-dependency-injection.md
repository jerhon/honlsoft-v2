---
date: "2021-04-10"
title: "Design Patterns: Dependency Injection"
tags: ["dotnet", "dependency-injection", "patterns"]
type: "blog"
description: "Describes in brief the idea of dependency injection."
---

One of my favorite features of .NET Core / .NET 5+ is it's dependency injection (DI) framework.
If you've been stuck in .NET Framework, or old ASP.Net, it is one of the biggest fundamental changes with how applications are pieced together.

I had started using a now abandoned [IoC container, Ninject](http://www.ninject.org/index.html) close to ten years ago.
It radically changed the way I approached writing software. 
I was very happy to see .NET Core embrace this DI pattern.

# What is Dependency Injection

In short, Dependency injection is a practice used to decouple code by providing external dependencies to a class through a constructor, method, or property rather than concretely calling or constructing them in an implementation.

I'm going to give an example that's somewhat contrived.
In the following code, I have a Driver which can drive a vehicle.
Since the vehicle is passed in via the constructor, my class isn't tied to any particular vehicle.
I'm using dependency injection via the constructor to obtain the IVehicle instance for my Driver.

```csharp
public interface IVehicle
{
    void Drive();
}

public class TestVehicle : IVehicle
{
    public void Drive()
    {
        Console.WriteLine("You're driving in a Test Vehcile!");
    }
}

public class MiniVan : IVehicle
{
    public void Drive()
    {
        Console.WriteLine("Your driving in a Van!");
    }
}

public class Driver
{
    private readonly IVehicle _vehicle;
    
    public Driver(IVehicle vehicle)
    {
        _vehicle = vehicle;
    }

    public void GoSomewhere()
    {
        _vehicle.Drive();
    }
}
```

The decision of what concrete implementation to use is now made somewhere else.
While this may seem like a change that just introduced a lot of extra boilerplate logic, it really makes the code much more nimble.

As opposed to this, which would not be using dependency injection.

```csharp
public class Driver
{
    public void GoSomewhere()
    {
        var van = new MiniVan();
        van.Drive();
    }
}
```


The decision of what vehicle to use is made explicitly in the class.
This may be slightly less code, but consider this has tied all driver to a MiniVan.
While I applaud the driver's sensible life choices, certainly not a lifestyle everyone can get behind.

# Why Use Dependency Injection

The main reason for dependency injection is that it decouples code.
Practically this means implementations for dependencies can be swapped and potentially don't need to even be concretely written yet.

This decision is also made outside the class and commonly as part of some application startup.
For example, in the previous example. we could pass in a TestCar when we're testing rather than a working Van class.

# Practical Use Cases 

Let's think of a more concrete example.  Let's say I have an EF core DB context, with a controller using it.
If I pass the DB context in the constructor (think of the example above with the vehicles), I can then decouple how that context is created from the actual usage of it.
The container could pass in a DB context set up to work with a SQL Server database when it's running normally, and a different one set up with an in memory SQL Lite database when it's running in a test context.

FOR YEARS, that was a use case I heard developers tote with their custom/handcoded/sql mainia.
When push came to shove, it never lived up to the hype.
Finally, with these types of patterns, and EF core, use cases like this are actually possible.

Configuration is also another common example.
Adding additional services can be used to alter the behavior or add behavior to a program.
For example, adding an IHostedService implementation through AddHostedService in .NET Core (see the sample program) will automatically pick it up to start running.

Another very popular use is to use a pattern called mocking in unit tests.
A mocked object can be introduced which implements the interface of the dependency injected in a class, but doesn't call an actual implementation.
This fake implementation can be modified to test out behaviors in the code under test by inducing the mock to return certian values, throw exceptions, etc.
If this intrigues you, my favorite mocking libraries is [Moq](https://github.com/moq/moq4).

# Object Construction

The last piece to the puzzle is, how do I construct all these objects then?
In the example with the Driver, I'd need to pass in a type of IVehicle in the constructor.
Wouldn't the code above that become coupled to the type of vehicle?

This is where a DI framework comes into play.
A container or sometimes called a DI kernel, sometimes an IoC container, is set up to resolve different types and interfaces to concrete implementations.
When a new class is needed, the container traverses the class hierarchy and as it constructs each object it will pick a pre-chosen implementation.

For example, in practice in .NET core, if I were to indicate the following classes should be instantiated.

```csharp
services.AddSingleton<IVehicle, MiniVan>();
services.AddSingleton<Driver>();
```

When the Driver is instantiated through the container, it would end up using a MiniVan as a vehicle.
This ends up being at the top level of a program, the place where configuration decisions are made.

I have to write no logic to create the MiniVan in the actual business logic of the code, it is done for me.
See the GitHub repo later for a full example.

For example in a .NET application utilizing its Generic Host framework, to use this, we'll use an IHostedService which will run on startup.  
We'll call this TravelService, and have it call the Driver to GoSomewhere()

```csharp
public class TravelService : IHostedService
{
    private readonly IHostApplicationLifetime _lifetime;
    private readonly Driver _driver;
    
    public TravelService(Driver driver, IHostApplicationLifetime lifetime)
    {
        _driver = driver;
        _lifetime = lifetime;
    }
    
    public Task StartAsync(CancellationToken cancellationToken)
    {
        _driver.GoSomewhere();
        _lifetime.StopApplication();
        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
```

Then in our services collection, we register this.

```
services.AddHostedService<TravelService>();
```

When the application starts, it will run the TravelService and eventually stop and shutdown the service after doing it's work.
With this we've effectively decoupled much of the implementation.
The Driver service gets an IVehicle, but doesn't need to know the concrete implementation.
The TravelService runs and kicks off the whole process, but doesn't need to know the inner workings of the Driver service, nor worry about constructing its dependencies.  

The full details are in the GitHub repository mentioned later in this article.

# Lifecycles

You'll notice it's not as simple as just referencing the class.
The classes and implementations added to a DI container have a lifecycle associated with them.
It's a crucial concept to understand.
The default DI in .NET core comes with three.

* Singleton
* Transient
* Scoped

Let's say the program requests the Driver class many times.
By registering the Driver class as a singleton, it would resolve the same object instance every time it's used.
In the days before DI, this usually translated into using a anti-pattern with static classes.

Transient ends up resolving a new class every time it's injected.
If there were 3 different Driver classes and it were marked as transient 3 different Driver object instances would be instantiated.

Finally is scoped, and it's a special situation.
Scoped means resolve the same value within the context of something.
The most common is within the scope of an HTTP request.
For example, for an ASP.Net request, retrieve the same EF Core database context.

# Wrapping Up

ASP.Net Core has a very strong leaning towards dependency injection.
The pattern is very important to know and grasp when moving ASP.Net to ASP.NET Core.

This really isn't just specific to .NET either.
Many other frameworks buy into this pattern as well.
Spring Framework in Java buys heavily into this type of pattern.
Angular does as well.

If you want to see my code samples in full context, I committed a very simple .NET Console application [with the full example to GitHub.](https://github.com/jerhon/hs-examples-dotnet-console-di)
If you want to see some specific examples in context of an ASP.Net core application, you can see it in my [Raspberry Pi Camera Service](https://github.com/jerhon/hs-pi-camera-service) 
