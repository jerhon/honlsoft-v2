---
date: "2021-08-30"
title: "Building APIs: Generating API Clients with OpenAPI Generator"
tags: ["api", "dotnet", "openapi", "csharp", "typescript"]
type: "blog"
description: "How to automate generation of an API client from an OpenAPI specification."
---

APIs are everywhere!
APIs are one of the basic building blocks of modern software architectures.
With the proliferation of HTTP based APIs, facilitating API consumption with minimal effort becomes crucial.

The bridge between programming languages and APIs is to use a programmatic API specification that defines the contracts of the API.
From there, utilizing tools to read that specification to generate an API client.

When utilizing a single language, it's sometimes possible to use the same contract types for the client code as the server code.
However, in many programming environments that is rarely possible.
For example, in Single Page Web applications, the front end of an application my be written in Typescript, but rely on an API written in C#, Java, or Go.
Another common example may be consuming the API in test tooling like Postman or SoapUI.

In this post, I'm going to talk about setting up an API specification via [OpenAPI](https://www.openapis.org/), and automatically generating the client code off of if with the [Open API Generator](https://openapi-generator.tech/).
In combination with .NET Core / .NET 5+ and the OpenAPI Generator, it's quite simple to set up.

# OpenAPI / Swagger

OpenAPI is a specification for a JSON file which describes the shape and call signature of HTTP based APIs.
This includes the contracts for both parameters and return of the APIs.
Swagger is an older version of this specification before it became OpenAPI.
Sometimes OpenAPI and Swagger end up getting used interchangeably.

In statically typed programming languages, the contracts can be determined from the call signature of an implementing API through type reflection.
For example, in C#, consider the following method signature in a WebAPI controller:

```csharp
[HttpGet("states/{state}")]
[ProducesResponseType(typeof(IEnumerable<CovidStateStatistic>), 200)]
public async Task<IActionResult> Get(string state, DateTime? startDate)
{
    // ... Some code goes here ...
}
```

By adding the ProducesResponseTypeAttribute to the signature of the method, the API and it's return type can be determined via reflection and defined in it's specification.
In many cases, that's all that is needed.
For some signatures, it's not needed at all.
For example:

```json
{
  "paths": {
    "/api/covid-19/states": {
      "get": {
        "tags": [
          "Covid19"
        ],
        "parameters": [
          {
            "name": "state",
            "in": "query",
            "schema": {
              "type": "string",
              "nullable": true
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "application/json": {
              "schema": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/CovidStateStatistic"
                }
              }
            },
            ...
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "CovidStateStatistic": {
        "type": "object",
        "properties": {
          "submissionDate": {
            "type": "string",
            "format": "date-time"
          },
          "state": {
            "type": "string",
            "nullable": true
          },
          "totalCases": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },

          ...
          
        },
        "additionalProperties": false
      }
    }
  }
}
```

While it may be useful to understand the JSON file at a high level, in depth knowledge isn't needed to generate the client code.

# Setting Up the .NET Web API Project

Setting this up this generation is relatively easy, and if you use the default .NET core templates for WebAPI, you will just get this functionality out of the box.
With the `Swashbuckle.AspNetCore` nuget package is relatively easy to set up.

```csharp
public void ConfigureServices(IServiceCollection services)
{
    // ... Other container items added ... 
    services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Honlsoft.CovidTracker.Api", Version = "v1" });
    });
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // ... Other usings throughout ...
    app.UseSwagger();
    app.UseSwaggerUI();
}
```

Now I can get the OpenAPI specification for the file at the following URL when I'm running the application: `https://localhost:5001/swagger/v1/swagger.json`
Of course, there are all kinds of options on the swagger gen to specify things like the URL of the resulting document, naming, information in the output OpenAPI file.
The defaults work well enough to get started though. 
The .UseSwaggerUI() uses a call to add the prepackaged Swagger UI to the project.

One of the tweaks I like is to only serve the swagger file on development builds and leave it out of production.
Generally, I'm not building something that is publicly available for others to access.

# OpenAPI Generator

There are several tools that can be used to generate client code.
NSwag is popular in the .NET community.
However, the one I've found that works the best is the [OpenAPI Generator](https://openapi-generator.tech/).
For me this really this is with it's `typescript-axios` generator.
Other generators, such as NSwag, polluted DTOs with methods.
This made them difficult to use in state stores such as Redux as I would have to mutate the API return prior to storing it in a Redux Store.

I usually generate the client code by running the OpenAPI generator in Docker.
This avoids me having to get the Java JRE which has gotten extremely messy with their new strategy of one release a year AND having many companies build their own Java JRE.
Docker eliminates this by being able to have the command and its dependencies bundled together in the image that's run.

For Typescript projects, I keep my api clients in an `api` folder under `src`.
I use a Powershell script which downloads the latest OpenAPI specification (assumming it is running on my machine), and then runs the Docker command to generate the API.
The Docker command I use looks something like this in a powershell file to download the `.json` file, and generate it. 

```powershell

Invoke-WebRequest https://localhost:5001/swagger/v1/swagger.json -OutFile $PWD/api/covid-api.json

# Run the actual generation process
docker run --rm -v $PWD/api:/local/api openapitools/openapi-generator-cli `
    batch /local/api/covid-api-parameters.yaml
```

The `covid-api-parameters.yaml` is a yaml file with the configuration properties to generate the API client.
This is kept in the `api` folder.

```yaml
inputSpec: /local/api/covid-api.json
generatorName: typescript-axios
outputDir: /local/api/client
additionalProperties:
  supportsES6: true
  withSeparateModelsAndApi: true
  apiPackage: api
  modelPackage: model
```

And after generation, here is some of the sample code that it used to generate a class I can use as an API client.

```typescript
/**
 * Covid19Api - object-oriented interface
 * @export
 * @class Covid19Api
 * @extends {BaseAPI}
 */
export class Covid19Api extends BaseAPI {
    /**
     * 
     * @param {string} [state] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof Covid19Api
     */
    public apiCovid19StatesGet(state?: string, options?: any) {
        return Covid19ApiFp(this.configuration).apiCovid19StatesGet(state, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {string} state 
     * @param {string} [startDate] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof Covid19Api
     */
    public apiCovid19StatesStateGet(state: string, startDate?: string, options?: any) {
        return Covid19ApiFp(this.configuration).apiCovid19StatesStateGet(state, startDate, options).then((request) => request(this.axios, this.basePath));
    }
}


// The interface that's returned


/**
 *
 * @export
 * @interface CovidStateStatistic
 */
export interface CovidStateStatistic {
  /**
   *
   * @type {string}
   * @memberof CovidStateStatistic
   */
  submissionDate?: string;
  /**
   *
   * @type {string}
   * @memberof CovidStateStatistic
   */

  // shortened for the article...
}
```

That isn't the full set of code, but it gives you an idea of the call signature around the class.
Consumption requires constructing the class, and calling one of the methods.
The method names on the class match the API routes.

# Usage Tips

Since the OpenAPI Generator supports many languages, this same pattern can be used there as well.
It supports generating both Client side and Server side code.
Just take a look at [the list of generators](https://openapi-generator.tech/docs/generators).
To use a different generator, the yaml file I created just needs to be adjusted.

I like to use the batch command as it allows me to specify the config for the generation in a file.
For additional swagger files I can just copy and adjust the config.
However, there are a number of other commands that can be used, like `generate` to avoid having an extra config file.
It's really just preference.

# Wrapping Up

Right now, OpenAPI Generator is my goto tool for generating API clients based on swagger files.
It's verbose set of client generators, and it ease of use with Docker makes it a great way to automatically generate API clients.
I don't have a full code sample for this blog post, but plan on adding one in the future once I'm a further along with my current project.
