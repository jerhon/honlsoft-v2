---
date: "2024-01-21"
title: "Using Kiota to Generate an HTTP Client"
tags: [".NET", "Kiota", ".NET 8"]
type: "blog"
description: "Using Kiota to Generate an HTTP Client"
---

For years, I've been using [open api generator](https://github.com/OpenAPITools/openapi-generator) or [NSwag](https://github.com/RicoSuter/NSwag) to generate HTTP clients for my projects.
While this work well, there were edge cases I felt were hard to satisfy.
Recently I learned about [Kiota](https://learn.microsoft.com/en-us/openapi/kiota/overview) to generate API clients, and it takes a much different approach that I think is better.

# Generating an API Client to Chess.com

I've been playing chess online this year, and so I was very interested when I found out Chess.com has a public facing API to access user data.
I decided to take the API and write an open API specification for a few of the endpoints and try to generate the via Kiota.

Chess.com has the following endpoint `https://api.chess.com/pub/player/{username}/games/{year}/{month}` which can be used to get a list of all games played by a user in a given month.
While most API generators would generate some sort of client class with a method to call this endpoint, Kiota takes a different approach.

Kiota maps out the path of the API in a builder pattern.
This allows you to build up the path of the API and then call the HTTP client to execute the request.
To me this feels like a much more natural way to interact with the API.

I can directly reference the specification and clearly see the path and API calls I must make.

For example, to call the endpoint above, the code would look like this:

```csharp
var client = new ChessComClient(/** ... extra settings here ... **/);
var games = await client
    .Player["junk_user"]
    .Games["2024"]["01"]
    .GetAsync();
```

The `games` variable is an object representing the JSON data returned from the API.

The calling construct can change slightly, but the overall idea in CSharp is to use the indexer syntax to provide path parameters.

This is much different than other API generators.
Rather than adhering to the path and building requests based off the path, the path is abstracted away.
This can be useful in some cases, but it can also be confusing when trying to understand the API.

For example the method to get a player's games may be generated on the client class as a method `.GetPlayerGames`.
While the call could be inferred from the name, it's not as clear as the Kiota client.
It also makes the groupings of the API much less natural.
As the API grows, the client class can become very large with a variety of methods from different types of resources. 

The Kiota client has a direct mapping between the API path and the client.
I feel it makes it much more clear which endpoints are being called.

# Using the CLI to Generate the Client

The actual command to generate the client is a simple CLI command.

```
kiota generate -l CSharp -c ChessComClient -n Honlsoft.Chess.ChessDotCom -d ./chessdotcom.yaml -o ./Client
```

This generates a class named ChessComClient in the namespace Honlsoft.Chess.ChessDotCom in the directory ./Client from the Open API spec chessdotcom.yaml.

The CLI supports multiple programming languages with a very similar programming model.
There are languages that don't support features such as indexers, but the syntax is replaced with method calls in those cases.

It also has a variety of options that many of the other client generators are missing.

For example, including and excluding specific APIs based on the OpenAPI path.
For large complex API sets, this can be very useful when only a subset of a few requests are needed.

In our example above, the endpoint looks something like this in the Open API spec.
Note how the path parameters map to the indexers in the calls above.

```yaml
  /player/{username}/games/{year}/{month}:
    get:
      summary: Get monthly archives
      description: Get monthly archives
      operationId: getMonthlyArchives
      parameters:
        - name: username
          in: path
          description: The username of the player
          required: true
          schema:
            type: string
        - name: year
          in: path
          description: The year of the archive
          required: true
          schema:
            type: integer
        - name: month
          in: path
          description: The month of the archive
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  games:
                    type: array
                    items:
                      type: object
                      properties:
                        #... truncated for brevity.. additional properties here
```


# Wrapping Up

Kiota is a good tool for automatically generating clients based on Open API specifications.
I've only just started scratching the surface of what it can do, but I like what I've seen so far.
I plan to continue use it for more of my projects going forward.

If you need to generate an API client from an Open API specification, I'd suggest you give it a try.
