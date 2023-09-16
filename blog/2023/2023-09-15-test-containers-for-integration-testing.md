---
date: "2023-09-15"
title: "Utilizing Testcontainers for Integration Testing"
tags: ["containers", "docker", "integration-testing", "testing"]
type: "blog"
description: "Utilizing Testcontainers for integration testing."
---

When writing automated tests, one of the hardest parts of is when integration testing and external dependencies are required-- like a database or external service.
While running these things may not be hard an and of itself, maintaining consistency between the tests and the dependencies can be difficult.

Recently, I've been working on a legacy data access library that needed some refactoring to get to .NET 6 from .NET 4.8.
During this process, I needed some way to test that the functionality still worked.
I also wanted to do this in an automated way so the tests could really run from any machine.

Containers provide an excellent way to provide an on demand database with a consistent setup.

In this post, I'm going to talk about a nice NuGet package I ran across that uses containers to simplify this process.

# Testcontainers

[Testcontainers](https://testcontainers.com/) is a multi-programming-language project that makes it easy to setup and run containers from code.
There are many use cases, but one I've used it recently for is integration testing.

I have a project which depends on a database.
For testing some of the core integrations with the vendor specific library, I needed a database.
While it's possible to point at some pre-existing database, it's hard to depend on because it's an external system.
It can change - go up or down independent of the test.
Another issue may be that it can't handle multiple concurrent tests from different machines.

Being able to instead run the database in a container allows me to setup and run a database on demand.
Since it's in a container, it can run on the same machine that runs the integration tests.
The tests become much more portable.
Any machine that runs the unit tests simply needs docker installed as well.

# Test Container Running Postgres

To show this I'm going to set up a sample C# program which runs a Postgres database in a container.

# Running the Postgres Database

First I will have the C# application which runs the container.

```csharp
// Important: Init scripts are copied to the bin directory when compiled.
var initScriptsPath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
initScriptsPath = Path.Combine(initScriptsPath, "DbScripts");

var password = Guid.NewGuid().ToString();
var container = new ContainerBuilder()
    .WithImage("postgres:16")
    .WithPortBinding(5432, true)
    .WithBindMount(initScriptsPath, "/docker-entrypoint-initdb.d", AccessMode.ReadOnly)
    .WithEnvironment("POSTGRES_PASSWORD", password)
    .WithWaitStrategy(Wait.ForUnixContainer().UntilPortIsAvailable(5432))
    .Build();

try {
    await container.StartAsync();
}
finally {
 
    var (stdout, stderr) = await container.GetLogsAsync();

    Console.WriteLine(stdout);   
}
```

That's it.
I was really impressed with how simple the builder pattern makes for constructing the container.

While this would all be possible from manually invoking the docker CLI, one of the big advantage of using the Testcontainers libraries is all the extras they have.

.WithPortBinding assigns to a random port on the machine, but we will later see that it's possible to query and find that port mapping.

.WithBindMount easily allows us to add mounts into the container.
If this had a pre-exisiting Postgres database we could easily mount it here.
In this case, I'm mounting a directory which has a single `.sql` file which creates the database.

.WithEnvironment adds an environment variable with a value to the container.

.WithWaitStrategy will wait for a specific condition before the container is considered started.
This has a ton of options like waiting for a port, or checking for a value on the console, etc.

The .GetLogsAsync allows me to get the logs from the container.  This is really useful if the container doesn't start properly, or to log them to keep tabs on how the application started.

There is more, these are just the options I used to get the basic database up and running.

# Connect and Query the Database

Connecting to the database is typical data access code.
Here's some ADO.Net code using the postgres driver to connect and perform a simple query.

```csharp
var connectionString = $"Host=localhost;Port={container.GetMappedPublicPort(5432)};Username=postgres;Password={password};Database=starfleet";
using NpgsqlConnection connection = new NpgsqlConnection(connectionString);
await connection.OpenAsync();

using var crewMembersCommand = connection.CreateCommand();
crewMembersCommand.CommandText = "SELECT * FROM CrewMembers";

using var crewMembersReader = await crewMembersCommand.ExecuteReaderAsync();

while (await crewMembersReader.ReadAsync()) {
    string name = crewMembersReader.GetFieldValue<string>("Name");
    Console.WriteLine(name);
}
```

This is pretty standard code to query a table from ADO.Net.
The one thing I want to point out is the call to get the mapped port for the postgres database.

Port mapping is an important feature in docker, and being able to use a random port allows us to easily run multiple instances of this to run on the same machine without having to worry about collisions.

# Using a Module Specific Nuget Package

In this case I used the base Testcontainers nuget package to illustrate creating a postgres database.
There are also many more Nuget packages for specific containers to run like Postgres, SQL Server, Redis.
These are very similar, they just simplify the process of creating the container with an API more specific to running those containers.


# Wrapping Up

[Testcontainers](https://testcontainers.com/) is an awesome tool to have in your toolbelt.
There are so many use cases from integration testing, to various CI processes like testing developer SQL scripts prior to rolling them out in a deployment.

In the past I had tried to run unit tests in  a container or as part of a docker compose definition.
However, Testcontainers makes it much easier.

I hope this simple example will show you how easy this is and get you started!
