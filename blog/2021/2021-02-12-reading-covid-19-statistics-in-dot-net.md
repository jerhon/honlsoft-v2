---
date: "2021-02-12"
title: "Reading COVID-19 Statistics in .NET"
tags: ["dotnet", "asp-net-core", "web-development", "covid-19-statistics-application-v3"]
type: "blog"
description: "Importing and Reading COVID-19 Statistics in .NET"
---

As part of my new COVID-19 application I've been writing, I had to import statistics from a data source.
[The COVID Tracking Project](https://covidtracking.com/) maintains daily records of various statistics regarding the pandemic for each state and at a nation level.
It publishes this data as an API and also as a set of CSV files.

While the API worked, it did not provide the type of extensibility I wanted in order to serve up the data.
As such, I decided to read the raw data from a CSV file to import into a database hosted by EF Core.
This blog will describe the process of data in a CSV format in .NET.


# CSV

What is CSV?
It's data stored in a very specific format.
It stands for "Comma Separated Values", but in truth it is much more complicated than that.
It is a specific interchange format to transmit data in a semi-tabular form with very specific rules.
The specifics of are documented in [RFC-4180](https://tools.ietf.org/html/rfc4180).

I have often heard a common misconception of, I cannot have a comma in a CSV file because the comma is used to separate the fields.
Only a precursory reading of CSV as "Comma Seperated Values", or utilizing CSV developer libraries that do not properly implement the specification will cause this.
That's why it's very important to use a well written third party library to deal with interchange formats such as CSV.
Misconceptions like this cause logic to break and can easily over complicate business rules!

For the purpose of this project I will be using a popular CSV library for .NET, [CsvHelper](https://www.nuget.org/packages/CsvHelper/)

# Importing the CSV Data

There are a few parts to this.

1. Creating the .NET objects to represent the data
2. Making the request to retrieve the data
3. Parsing the data from the request.

# CSharp Classes for the Data

First, the classes need to be made to set up to match the CSV data.
Note each column has a property, and each property should have a data type.
This is VERY important as this class will be used later as an object in our EF Core database.

The required fields can be determined from the documentation on [The COVID Tracking Project](https://covidtracking.com/about-data/data-definitions).

```CSharp
public class CovidNationDailyRecord : ISourceHash
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public int States { get; set; }
    public int Positive { get; set; }
    // And so forth...   
    public byte[] SourceHash { get; set; }
}
```

# Making the Request to Retrieve the Data

Making HTTP requests in .NET Core is very simple.
Inject an IHttpClientFactory via the constructor.
Obtaining an HttpClient is a matter of calling the client factory to create a client.
Using .GetStreamAsync() returns a stream of the response data.
The call to parse the csv records is shown later.

```CSharp
public CovidTrackingDataService(IHttpClientFactory clientFactory)
{
    _clientFactory = clientFactory;
}

public async Task<IAsyncEnumerable<CovidStateDailyRecord>> GetDailyStateRecordsAsync()
{
    var httpClient = _clientFactory.CreateClient();
    var stream = await httpClient.GetStreamAsync("https://covidtracking.com/data/download/all-states-history.csv");
    return ParseCsvRecords<CovidStateDailyRecord>(new StreamReader(stream));
}
```

# Parsing the Data

Finally, parsing the data responded by the HTTP call.
This reads the CSV file record by record, and yields an object for each record.
There is some extra logic that I added to deal with specific cases, in the data.

The library has a CsvConfiguration object which can control much of the logic in parsing the CSV file.
A CSVReader is a class that takes the data to parse, and the configuration.
It can then be used to read out the records from the data.

I decided to have the data return 0 rather than null if a number is not reported.
For the sake of the queries I am running, I'm considering no data being reported being the same as reporting 0 as the data.
Some states would report numbers, others would not report any data for the same statistics, etc.
Typically, when there are gaps in data they are reported in subsequent days, and most data sources have seemed to be contiguous as missed data reporting often reports the same data as the previous day.
There are other ways I could fill the data, but this was just to keep things simple for my use case.

```CSharp
public static async IAsyncEnumerable<TRecordType> ParseCsvRecords<TRecordType>(TextReader textReader)
{
    
    CsvConfiguration config = new CsvConfiguration(CultureInfo.CurrentCulture)
    {
        MissingFieldFound = null,
        PrepareHeaderForMatch = (header, idx) => header.ToLower(),
    };
    config.TypeConverterCache.RemoveConverter<Int32Converter>();
    config.TypeConverterCache.AddConverter<int>(new MyInt32Converter());

    CsvReader reader = new CsvReader(textReader, config);
    
    if (await reader.ReadAsync())
    {
        reader.ReadHeader();
        while (await reader.ReadAsync())
        {
            var record = reader.GetRecord<TRecordType>();
            if (record is ISourceHash sourceRecord)
            {
                var hash = CalculateHash(reader.Context.Record);
                sourceRecord.SourceHash = hash;
            }
            yield return record;
        }
    }
}
```

# Wrapping Up

Again I love how .NET 5 / .NET Core makes simple tasks easy.

All the code for the project can be found in [the GitHub repository for the application](https://github.com/jerhon/covid-19-stats-v3).
