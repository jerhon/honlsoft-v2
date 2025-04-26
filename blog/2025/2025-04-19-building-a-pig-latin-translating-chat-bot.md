---
date: "2025-04-19"
title: "Building a Pig Latin Translating Chat Bot"
tags: ["Python", "AI", "LangChain"]
type: "blog"
description: "Building a Pig Latin Translating Chat Bot"
---

Generative AI is reshaping software development and becoming a tool that is rapidly expanding in capability.
As such, I plan to spend more time on learning and implementing AI-related functionality over the coming year.

I'm going to make an LLM that translates a statement to pig latin.
Pretty quickly we'll see the AI chatbot has varying degrees of success performing even this basic task.
I will offload the task of doing the pig latin translation to a tool with the LLM will invoke.
We'll improve the chatbot by moving the pig latin translation to a tool which the chatbot can invoke to then translate statements to pig latin.

While I've generally stuck to the .NET stack in the past, [Python](https://www.python.org), along with [LangChain](https://www.langchain.com) are better options at the moment.

## Creating the Initial Bot

I'll be using [Ollama](https://ollama.com), to run AI models locally on my machine.
I won't be covering that here.
I am assuming it is up and running locally either via their Desktop app, or via a Docker container.

The first set of code is fairly straight forward.
We'll create a general chat agent.

```python
from langchain_ollama import OllamaLLM
from langchain_core.messages import HumanMessage, SystemMessage
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

def main():
    # Initialize the Ollama LLM
    # Note: This assumes Ollama is running locally on the default port
    llm = OllamaLLM(model="llama3.2")
    
    messages = []
    
    message = "init"
    while (message != ""):
        message = input("Enter your query:")
        
        messages.append(HumanMessage(message))
        response = llm.invoke(messages)
        
        print(f"Response: {response}")

if __name__ == "__main__":
    main()
```

Let's ask our LLM to translate a statement to pig latin:

```
Enter your query:Translate this statement to pig latin. "Pete the cat has a very nice hat."
Response: To translate "Pete the cat has a very nice hat" into Pig Latin, we need to follow these rules:

- If a word starts with a vowel, we simply add "way" or "yay" to the end.
- If a word starts with a consonant, we move that consonant (and any consonants after it) to the end of the word and add "ay".

Here's the translation:

* Pete: etay
* the: eathay
* cat: atcay
* has: ashway
* a: aay
* very: eryvay
* nice: icenay
* hat: athay

So, the translated statement in Pig Latin is: "Etehay ethay atcay ashay avery  niceway athay!"
```

It's very verbose, and the interesting thing is while the LLM goes to great lengths to explain how to translate something to pig latin, in the end, its translation doesn't match its own rules!
Let's improve this with some prompt engineering.

Let's give the LLM some guidance to not explain how to translate Pig Latin but only provide the translation.
We'll provide some system messages to help guide the LLM.

```
    messages = [
        SystemMessage("You are a chatbot."),
        SystemMessage("Do not explain how Pig Latin works.")
    ]
```

Trying again:

```
Enter your query:Translate this statement to pig latin. "Pete the cat has a very nice hat."
Response: The translation of "Pete the cat has a very nice hat" in Pig Latin is:

"Etepetay hetay atcay asbay averyay icesnay atay."
```

It's better, but you can tell the LLM is really having problems doing the transformation involved for pig latin.

We're going to step in and provide a translator to pig latin for the LLM.
This way, the LLM can respond to the query, but when it needs to respond with something in pig latin, it will call out to a function we define that does the translation.

To do this, I'm going to implement a tool.
A tool is a piece of functionality LLM can call to perform an action.
The tool in this case will input a statement and transform it using our rules for pig latin.

1. If a word begins with a consonant, move that letter to the end of the word and append `ay`.
2. If a word begins with a vowel, add `way` to the end of the word.

It's debatable whether those are the true rules of pig latin, but for the case of this sample, the important part is that the LLM offloads the translation of the statement to the new tool.
I will not show the full implementation of the pig latin tool for brevity, but in LangChain we can implement this through decorator on a python function.

```python
@tool
def to_pig_latin(text: str) -> str:
    """Translates a statement to pig latin.
    Pass in the original value and it will be translated to pig latin.
    Do not pass in text that has already been translated to pig latin. """
    
    # Implementation goes here...
```

The tool passes information about the function and the description to the LLM for it to use.

## Hooking in the Tool Call

Working with the LLM works slightly different with the tool calls now.
An extra pass is needed to receive any tool call requests the LLM makes, perform them, and then provide the details back to the LLM.

First, we need to give the LLM the tool call.
The tool is bound to the original LLM.

```python
    llm_with_tools = llm.bind_tools([to_pig_latin])
```

Next, we need to look at the tool call requests and process them.
In this example, I'm assuming all tool calls are for my `to_pig_latin` function.
However, it's possible to have multiple tools.
In that case we'd have to examine the tool call before invoking the tool to be sure I invoke the correct one.

Once the tool call has been made, we pass back the original message, with the AI's response back and the tool call invocation.
If everything works correctly, we'll get an answer and we should see in the messages the tool call being made.

```python
        response = llm_with_tools.invoke(messages)

        if response.tool_calls:
            messages.append(response)
            # print(response.tool_calls)
            for tool_call in response.tool_calls:
                tool_msg = ToolMessage(to_pig_latin.invoke(tool_call), tool_call_id=tool_call["id"])
                # print(tool_msg)
                messages.append(tool_msg)

            print(messages)
            response = llm_with_tools.invoke(messages)
```

I'm printing out the messages so that we can see exactly what we send back to the LLM.
Then I print the content of the message.

## Putting it all Together

Now that everything is hooked up, let's see what happens.
I have formatted the messages in the printed text.

```
Enter your query:Translate this statement to pig latin. Pete the cat has a very nice hat.
Response: The Pig Latin translation of the statement is: "etePay hetay atcay ashay eryvay icenay athay"
```

The messages look like this, omitting the final message which was output as the response.

```
[   
    SystemMessage(content='You are a chatbot.', additional_kwargs={}, response_metadata={}), 
    SystemMessage(content='Do not explain how Pig Latin works.', additional_kwargs={}, response_metadata={}),
    HumanMessage(content='Translate this statement to pig latin. Pete the cat has a very nice hat.', additional_kwargs={}, response_metadata={}),
    AIMessage(content='', additional_kwargs={}, response_metadata={'model': 'llama3.2', 'created_at': '2025-04-19T23:15:57.0276351Z', 'done': True, 'done_reason': 'stop', 'total_duration': 563101500, 'load_duration': 57378100, 'prompt_eval_count': 215, 'prompt_eval_duration': 6000000, 'eval_count': 28, 'eval_duration': 497000000, 'model_name': 'llama3.2'}, id='run-7c79f15a-380f-41c0-ba3c-95066dbb3232-0', tool_calls=[{'name': 'to_pig_latin', 'args': {'text': 'Pete the cat has a very nice hat'}, 'id': 'ef1e1c11-1c7c-4062-a05e-73b74018cfa1', 'type': 'tool_call'}], usage_metadata={'input_tokens': 215, 'output_tokens': 28, 'total_tokens': 243}), 
    ToolMessage(content="content='etePay hetay atcay ashay eryvay icenay athay' name='to_pig_latin' tool_call_id='ef1e1c11-1c7c-4062-a05e-73b74018cfa1'", tool_call_id='ef1e1c11-1c7c-4062-a05e-73b74018cfa1')
]
```

From the output you can see after our original call, the LLM passed back a message which LangChain interpreted into an AIMessage as a tool call.
Our code took the tool call from the `.tool_calls` property executed the proper functionality and passed back a `ToolMessage` with the resulting pig latin translation.
After sending those messages to the LLM again, we got our response which used the translation from our pig latin tool `The Pig Latin translation of the statement is: "etePay hetay atcay ashay eryvay icenay athay"`

## Wrapping Up

LLMs provide the ability to respond to human interactions through natural language.
This example shows a simple way to extend LLMs by hooking in tools to perform processing.

There are many other ways tools can be utilized, other ideas include things such as:
* Retrieving domain-specific data for an LLM response.
* Using a search engine to retrieve relevant information before responding.
* Looking up a template to aid in answer generation.

This was a quick conceptual example.
Of course, if I were to use something like this in the real world, much more testing is required.

However, this was an incredibly simple project to build.
As LLMs become more intelligent, capabilities like this will be easier and easier to build.

I hope you found this quick example of using an LLM locally along with a tool useful!

Find the full source code on my [GitHub repo](https://github.com/jerhon/langchain-piglatin).