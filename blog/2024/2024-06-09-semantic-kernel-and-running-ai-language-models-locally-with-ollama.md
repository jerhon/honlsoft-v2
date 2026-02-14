---
date: "2024-06-09"
title: "Running Local Generative AI Models in .NET Locally With Semantic Kernel and Ollama"
tags: [".NET", "Kiota", ".NET 8"]
type: "blog"
description: ""
---

Generative AI is taking the world by storm.
As a developer I'm generally intrigued with what I will be able to build with it.

However, when researching I generally find pages with a lot of setup to run models locally.
While using SAAS AI services such as Open AI or Azure AI bridge this gap and make it easier, I've really wished there was a simple solution to run models locally. 

During the Microsoft build conference I was introduced to the Phi small language models and Ollama. 
Ollama makes it possible to run generative AI models locally on a machine as easy as it is to run containers in docker.
Pull an AI model and run it.

# Getting Started With Ollama

Ollama is hands down the easiest way to get started with generative AI.
[Download Ollama here.](https://www.ollama.com)

Instructions are on [the Ollama GitHub page](https://github.com/ollama/ollama).

Once it's been downloaded and installed, it's as simple as running a command.

From a command line run ```olama run phi3```.
You'll be presented with a prompt where you can start "chatting" with the Generative AI.

```
> ollama run phi3
>>> What is the best chess opening?
 The notion of a "best" chess opening can vary depending on personal style, level of play, and specific
strategies. However, some openings are widely respected for their balance between sound principles, flexibility,
and historical effectiveness against various responses.


Here are a few highly regarded chess openings:

1. **The Ruy López (Spanish Opening)** - Known for its strategic depth and long-term planning, it is popular among
classical players.

2. **Sicilian Defense (Open Sicilian)** - A favorite of aggressive players who seek counterplay against 1.e4.

... the model continues ...
```

# Semantic Kernel

Being a developer, now that we have an AI chat bot available locally, how do I actually code it to do something?
This is where Semantic Kernel will help.

Semantic Kernel is a NuGet package by Microsoft which abstracts APIs available by 



Prompt engineering.
I never understood why it was so complicated until I started playing around generative AI.

Generative AI is general a request response model.
Create a prompt, and have the generative AI respond to the prompt.

The prompt can be a question or it can be a statement telling it to do something.

```

```

# 