---
date: "2022-07-29"
title: "Metaprogramming in .NET: Building a Source Generator for a Factory Pattern with Roslyn"
tags: [".NET", "Roslyn"]
type: "blog"
description: "Talks about the process I went through to build a source generator to automatically build a factory from code."
---

In every project there is boilerplate code.
It is a particular evil more seen in statically typed languages with the need to express every object in a type safe way.
In this post I'm going to be talking about building a Source Generator with Roslyn to auto generate some of this boilerplate.

More specifically I'll be auto generating a factory for an object based off a constructor.

## What's a Factory

A factory is a design pattern focused on creating objects.
While factories have many useful applications, there are a few common scenarios I use them for frequently.

* When utilizing dependency injection container, a parameter is evaluated at runtime and other dependencies are resolved through the DI container.
* When there are several types with a common base interface or class, usually due to a polymorphic types and the right class needs to be constructed based on a parameter. 

Factories can be implemented several ways.
A factory can just be a method that is called that creates an object.
In other cases, it may be implemented as a class.

For the sake of our example, I will be building a factory through a class.
It should look something like this when it is complete:

```csharp
public interface IInstanceClassFactory {
	InstanceClass Create(string  regularParameter);
}

public class InstanceClassFactory : IInstanceClassFactory {

    private readonly InjectedClass  _injectedClass;

    public InstanceClassFactory(InjectedClass  injectedClass) {
        _injectedClass = injectedClass;
    }

    public InstanceClass Create(string  regularParameter) {
        return new(regularParameter, _injectedClass);
    }
}
```

This may seem needless, why not just use the `new()` in code where the object needs to be created?
The real crux is dealing with a DI container.
Creating the object allows injecting certain dependencies through the DI container, and parameters when the object is created.

This keeps our code SOLID as the dependencies needed to create the object aren't coupled to a process that needs a new object.

## The Source Generator

A source generator allows the injection of source code in the compilation pipeline of Roslyn.
A source generator is built is a .NET standard project that can be directly referenced in a coresponding project or published as a nuget package. 
My source generator will inspect the an abstract syntax tree for a constructor.
Based on the abstract syntax tree, I will generate the code matching the constructor and it's attributes.

This is a type of metaprogramming: using code as data to generate more code.
At a high level that is exactly what my source generator will be doing.

The constructor is the key here.
The source generator will look for a `[Factory]` attribute to know a particular constructor should be used to generate it.
The `[Inject]` attribute is used to differentiate which constructor parameters should be injected in the constructor of the built factory.
This will follow the premise that it is used with a DI container.
Any parameters without the `[Inject]` attribute will just be regular parameters as part of the create.


### The Generated Code

Here's an example of the code that will trigger the code generation.
```csharp
public class InjectedClass {
    public override string ToString() {
        return "Injected!";
    }
}

public class InstanceClass {

    private readonly string _regularParameter;
    private readonly InjectedClass _injectedParameter;
    
    [Factory]
    public InstanceClass(string regularParameter, [Inject]InjectedClass injectedClass) {
        _regularParameter = regularParameter;
        _injectedParameter = injectedClass;
    }

    public override string ToString() {
        return $"{_regularParameter} {_injectedParameter}";
    }
}
```

### The Generator Code

I'm not going to include all the code for the source generator.
It can be seen in my GitHub repository.


I have a seperate class `FactorySyntaxReceiver` this looks for any constructors matching the pattern I had described with the [Factory] attribute.
It collects the information and stores it on a collection.
This is hooked up during the `Initialize` method.

In the `Execute` method, it looks for the implemented SyntaxReceiver and then loops through any constructor info that was found and generates the source.
The `Sourcify` calls just build the source code.  The .AddSource method adds it to the source collection for the compiler to evaluate.

```csharp

[Generator]
public class FactoryGenerator : ISourceGenerator {

    // ...
    
    public void Initialize(GeneratorInitializationContext context) {
        context.RegisterForSyntaxNotifications(() => new FactorySyntaxReceiver());
    }
    
    public void Execute(GeneratorExecutionContext context) {

        var reciever = context.SyntaxReceiver as FactorySyntaxReceiver;
        
        try {
            foreach (var constructorInfo in reciever.ConstructorInfo) {
                context.AddSource($"I{constructorInfo.ClassName}Factory.cs", SourcifyFactoryInterface(constructorInfo));
                context.AddSource($"{constructorInfo.ClassName}Factory.cs", SourcifyFactoryImplementation(constructorInfo));
            }
        }
        catch (Exception ex) {
            context.ReportDiagnostic(Diagnostic.Create(GenericError, null, ex));
        }

    }
    
    // ...
}
```

## The Difficult Parts

Iterative development is rather difficult with Source Generators.
In several situations I've found myself where the IDE is using an old version of the Source Generator.
It's downright painful and a known painpoint of the Roslyn team for both Syntax Analyzers and Source Generators.

The documentation for Source Generators is incomplete.
This is even as they have been available for several years.

It takes some experimentation and just looking at code for other source generators as a reference.
However, I really wish there were better documentation.

One of the difficult parts with writing a source generator based off Roslyn syntax trees is that there are A LOT of potential edge cases.
Also, deducing namespaces and other information from just the syntax tree can be difficult without the semantic model.
I think I could reorganize my generator a bit to deal with this.

## What's Next

This was my initial iteration of my source generator to use as a proof of concept.
I have a few ideas to reduce the amount of code I need to write.
I want to reorganize it a bit to create code like this to avoid having to hand code constructors.

```csharp
public partial class InstanceClass {

    [Inject]
    private readonly string _regularParameter;
    
    [Inject]
    private readonly InjectedClass _injectedParameter;

}
```

And it will auto create the class constructor for me.
This would correct one of my biggest beefs with C# and writing SOLID code is the amount of boilerplate that needs to go into constructors.

## Wrapping Up

While source generators have their place, I would not suggest going wild and put them everywhere.
Places where C# forces writing the same code OVER and OVER, it can take away some of that pain.

My code is not done as it is in a POC phase at this point.
While I have a lot of TODOs to complete, for what I set out to accomplish with building a proof of concept source generator.

[Check out the current code out on GitHub.](https://github.com/jerhon/hs-dependency-injection-source-generators)
