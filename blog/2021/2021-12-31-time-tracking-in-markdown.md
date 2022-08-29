---
date: "2021-12-31"
title: "Tracking Time in Markdown"
tags: [".NET", "Practices"]
type: "blog"
description: "My Engineering Daybook: Tracking Time in Markdown"
---

Over the New Years break, I built a little console app to help with my new practice of engineering daybook.
Engineering daybooks are the practice of documenting what happened in a work day.
If you have read the [Pragmatic Programmer](https://www.amazon.com/Pragmatic-Programmer-Journeyman-Master/dp/020161622X), the practice is discussed in Topic 22.

It has also be an very long time since I've just written a simple console application, so I wanted to see what's available in the latest version of .NET and NuGet libraries.

## Engineering Daybook

I started keeping an engineering daybook about a month ago, but haven't been too consistent yet.
I kept the daybook really in two sections, first was specific times I did things, for reasons I metion later.
The second was just notes around things I had done.

With time tracking, the problem was just when I put down what I did around specific times, I'd have to go through my log and try tally everything up.
I could, but all the time math just got tricky especially on complex days.
I'd have to go through and add it up a few times just to make sure I was right.

I put other things in the daybook such as meeting notes, or just what I discussed with various folks or decisions that we made.
I don't log everything that goes on in a meeting, just items that are pertinent to me.
The practice of writing it down helps my memory, and also gives me a place to look back at.

I'm not a pro at it by any means at keeping my daybook, but progress requires starting followed by practice.
This is me starting.


## Time Tracking in my Engineering Day Book

With all that said, I've decided to just improve my day logs a bit.
Like I mentioned, I kept a time log at the beginning of my daybook, but I wasn't real consistent about how I formatted it.

I decided to start tracking it in a Markdown table, with 3 columns.
The first column being the time, the second being some sort of identifier for a task, the third being a description.
The task identifier is opaque, I don't need to reference the exact task ID, but it is used as a grouping mechanism to summarize my time.

```
| Time          | Task            | Description                                   |
|---------------|-----------------|-----------------------------------------------|
| 8:00AM        | e-mails         | Check up and answer e-mails for the day       |
| 8:15AM        | work item 123   | Worked on fixing production issue on form XYZ |
| 9:15AM        | team ceremonies | Daily stand up                                |
| 9:30AM        | work item 123   | Unit test production issue                    |
| 12:00PM       | lunch           | Eat lunch                                     |
| 1:00PM        | lead meeting    | Meeting with lead's on the team.              |
| 1:30PM        | work item 123   | complete fix, and check in                    |
| 3:00PM        | infra meeting   | meeting with IT infrastructure team on project|
| 3:30PM        | help co-worker  | Help co-worker on task                        |
| 4:45PM-5:00PM | time tracking   | Time logging                                  |    
| 8:00PM-9:00PM | work item 321   | Fix bug found in testing                      |    
```

At the end of the day, I need to total up the work and log each of these to specific tasks.
When I had originally started my day log, I hadn't really kept an idea of a task identifier on each time log.
That was something I had to go back and deduce at the end of the day or at some point of the day when I picked them up.


## Time Tracking at Work

For the past year and a half I've worked at a company that has very rigorous time tracking requirements.
Every minute of my work day (except for a 30 minute bucket we just get as "break time") needs to be logged specifically to some piece of work in the time tracking system.
The current time entry system just lets me add a total time behind each task for a day.
It makes it tough to enter time-- especially on days with lots of meetings when I need to context switch a lot.

I just needed a better way to deal with it.

I had thought about installing more full-featured time tracking software on my machine in a Docker container, but it seemed like overkill.
All I need to do is just keep a list of what I did for a day.


## The Command Line Application

I built a simple command line application which looks for these records and tallies them up.

The application runs over markdown, and detects table rows where the first column has my expected time format.
For matching rows, it will treat the second column as the task, and the third column as the description.

I set up the tool so that I could specify a time as either just a single time value, or a time range.
When a time range isn't specified, it just assumes the time specified is the start time, and it uses the end time based on the start of the next record.
Unless it's the last entry, then it needs to be a range, or just a single record to signify the end of the day.

Each day log I prefix with the date, 2021-12-31.md for example.

I run the command:

```
docker run -it --rm -v ${PWD}:/app/logs ghcr.io/jerhon/markdown-timelog logs summary
```

Since I don't include a date, it uses today's date, and scans for markdown files prefixed with it.
I'm having the docker command mount to the current working directory, and the shell I'm using is PowerShell for formatting.
After it scans the markdown file, it will group the items by the task identifier and add up the time for me.
This is what the output looks like on the command line.

```
                                Time Summary
  work item 123  █████████████████████████████████████████ 5
 help co-worker  █████ 1.25                                 
          lunch  ██████ 1                                   
  work item 321  ██████ 1                                   
   lead meeting  0.5                                       
  infra meeting  0.5                                       
        e-mails  0.25                                      
team ceremonies  0.25                                      
  time tracking  0.25                                      
┌──────────┬─────────────────┬─────────────────────────────────────────────────┐
│ Duration │ Task            │ Description                                     │
├──────────┼─────────────────┼─────────────────────────────────────────────────┤
│ 00:15:00 │ e-mails         │ Check up and answer e-mails for the day         │
│ 05:00:00 │ work item 123   │ Worked on fixing production issue on form XYZ   │
│          │                 │ Unit test production issue                      │
│          │                 │ complete fix, and check in                      │
│ 00:15:00 │ team ceremonies │ Daily stand up                                  │
│ 01:00:00 │ lunch           │ Eat lunch                                       │
│ 00:30:00 │ lead meeting    │ Meeting with leads on the team.                 │
│ 00:30:00 │ infra meeting   │ meeting with IT infrastructure team on project  │
│ 01:15:00 │ help co-worker  │ Help co-worker on task                          │
│ 00:15:00 │ time tracking   │ Time logging                                    │
│ 01:00:00 │ work item 321   │ Fix bug found in testing                        │
└──────────┴─────────────────┴─────────────────────────────────────────────────┘
```

If I want to provide a specific date I can use the --date argument: `... logs summary --date 2021-12-31`.

The application is packaged in Docker.
This allows me to use the tool on any machine that has docker installed without having to worry about other development dependencies.
The docker command can be shortened, but for the sake of this blog post I just wanted to be transparent about the command.

## System.CommandLine and Spectre.Console NuGet Packages

It's been a while since I have just built a command line application, so there are a lot of cool libraries for parsing the command line and formatting output.
I'm using [System.CommandLine](https://www.nuget.org/packages/System.CommandLine) for parsing of the commandline which gives me great help formatting like this:

```
Description:
  Time Log Helper for Markdown

Usage:
  hs-time-log [command] [options]

Options:
  --version       Show version information
  -?, -h, --help  Show help and usage information

Commands:
  logs  Operations for time logs in markdown files, by default will look for a markdown file with the current date in the filename such as 2021-12-28.
```

Or this if I were to just enter `hs-time-log logs`.

```
Required command was not provided.

Description:
  Operations for time logs in markdown files, by default will look for a markdown file with the current date in the filename such as 2021-12-28.

Usage:
  hs-time-log logs [command] [options]

Options:
  -?, -h, --help  Show help and usage information

Commands:
  get      Get and display time logs in a markdown file.
  summary  Get and display time summary by task.


```

[Spectre.Console](https://www.nuget.org/packages/Spectre.Console) was used for the Bar Chart, and pretty printing of the table.

## Wrapping Up

It's a pretty simple little utility.
The source is here: https://github.com/jerhon/markdown-timelogger
It's a work in progress and based on some pretty strict formatting rules, so don't expect it to work flawlessly.
I've added some unit tests, but plan on adding a few more.

I also plan on posting a few more articles on the various NuGet packages and the Clean Architecture principles I was able to apply in the application.
