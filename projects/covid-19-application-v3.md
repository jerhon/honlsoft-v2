---
date: "2021-01-30"
title: "COVID-19 Web Application with Heatmaps"
type: "projects"
image: "images/covid-19-app-v3.jpg"
project: "covid-19-statistics-application-v3"
---

I wrote another COVID-19 app.
This time in React / Redux .NET 5 / EF Core.
The .NET 5 application has several APIs to serve up the data, and hosts a React / Redux single page application to visualize the data.
That data comes from [The COVID Tracking Project](https://covidtracking.com/) and is hosted in an in memory SQL Lite database fronted by EF Core.

This project isn't available on the web, as I haven't really polished it as much as the previous application, and it requires more infrastructure to run since it's utilizing .NET core with a Web API to run.
It was a way for me to try piecing together several technologies and libraries I've been meaning to dig deeper into.
It's a little rough around the edges from an end user perspective.

This is much different from my first app.
The first app directly used The COVID Tracking Project APIs.
So, there were certain things it could not do with the data.
With this app since I've imported the data, I can transform it to present it in different ways.

The real thing I want to visualize were "the waves" of cases.
I did this through a heat map from the excellent [nivo visualization library](https://nivo.rocks/).
From the screenshot below, you can see this well in North Dakota.
There was a clear wave of positive cases November-January that have now trended downward.

Using Docker, the app can easily be run it on a machine if you want to give it a try here's the command line to download and run it.

```docker run --rm -it -p 8080:80 jerhon/hs-covid-app-v3```

Then navigate to http://localhost:8080 to see the application.

![COVID-19 Statistics Web Application](images/covid-19-app-v3.jpg)

Source code is available [on GitHub.](https://github.com/jerhon/covid-19-stats-v3)
