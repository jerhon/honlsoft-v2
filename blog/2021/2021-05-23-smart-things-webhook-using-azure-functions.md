---
date: "2021-05-23"
title: "Creating a Web Hook for SmartThings via Azure Functions"
tags: ["smartthings", "azure", "azure-functions"]
type: "blog"
description: "Describes creating a SmartApp for SmartThings via an Azure Function."
---

A few years ago, I started placing SmartThings sensors around my home.
Mainly, I have a few around doors around the house with contact sensors to know if they've been opened.

I've wanted to integrate with them for some time to build various applications around them, or to be able to audit things in my house such as if I leave a door open for too long.
SmartThings allows building web hooks (Smart Apps) to react to data and events.
So, I built a small Azure Function as a WebHook that SmartThings calls in real time to get this type of data.

I'm not going to go through the full process on how to set up a Samsung Developer or Azure Function, but will touch on what they are.
The documentation on how to get started on both of those is pretty good.
I'm going to talk about a few of the overall concepts, and how the code glues it all together.

## Building a Smart Things Smart App

Building a SmartThings Smart App is a semi-complicated venture without using an SDK.
The applications are really just HTTP webhooks that respond with information to requests by the Smart Things infrastructure.
Each request made to the webhook is part of a "lifecycle".

These request lifecycle events include things like `PING`, `CONFIGURE`, `UPDATE`, `INSTALL`, and so on.
Those 4 being mentioned are the absolute minimum that need to be implemented in order for the application to work.
When an application is registered in the SmartThings developer portal, an HTTP URL is supplied for the application.
As soon as that is done, it makes requests.
The first request is a PING, and that verifies that the webhook can be reached.

As soon as someone attempts to install the app, a series of calls are made to configure the app and trigger an installation.
The `CONFIGURE` lifecycle event defines a set of UI controls in a layout that are presented to a user through it's JSON response.
Elements on the UI are defined such as selecting sensors like temperature measurements, contact sensors, or a whole host of others in the SmartThings ecosystem.
It can also include inputs like text boxes to collect additional information from the user, labels or paragraphs for informational, or even complex multi-page layouts.
There are quite a few things that can be done with the layouts.

The `INSTALL` lifecycle event is called this is done after the user selections have been made and reported back to the user.
During this event, any calls to finalize installing the application should happen.
This could be updates to the Smart App's internal state like a database, or performing SmartThings API calls such as subscriptions for the selected sensors.

Finally, the application is considered installed.
Based on the subscriptions for the app, it will return events via the `EVENT` lifecycle event.
This will contain event data for devices that were previously subscribed to in the `INSTALL` event.
For example, temperature readings, whether the contact sensor is open or closed, etc.

## The SmartThings SDK

While this would be possible to code, there's a lot of interactions that the web hook needs to make just to subscribe to a simple set of events.
This is where the SmartThings SDK comes into play.
It provides a simplified way to manage the SmartApp lifecycle.

Using the SDK is pretty simple.
It's a Node.js package that needs to be installed as a dependency.
It also has a Java version available, but I really avoid using Java whenever possible.

For this application, I'll be building a single page that someone can select several contact sensors and temperature sensors.
The API uses a builder pattern where constructing an app is a series of calls the output the final application.

```javascript
 const smartApp = new SmartApp()
    .page('mainPage', (context, page, configData) => {
        page.name('Honlsoft Monitoring')

        page.section('temperatureSensors', section => {
            section.deviceSetting('temperatureSensors')
                .capabilities(['temperatureMeasurement'])
                .multiple(true)
        })

        page.section('doorSensors', section =>{
            section.deviceSetting('doorSensors')
                .capabilities(['contactSensor'])
                .multiple(true)
        })
    })
    .updated( async (context, updateData) => {
        await context.api.subscriptions.delete()
        await context.api.subscriptions.subscribeToDevices(context.config.temperatureSensors, 'temperatureMeasurement', 'temperature', 'temperatureSubscription')
        await context.api.subscriptions.subscribeToDevices(context.config.doorSensors, 'contactSensor', 'contact', 'doorsSubscription')
    })
    .subscribedEventHandler('temperatureSubscription', eventCallback)
    .subscribedEventHandler('doorsSubscription', eventCallback)
```

I didn't muck around with things like descriptions and adding text to describe the application.
This is really an application meant to be used just by myself.
So, I didn't spend much time polishing it.

The event callback is a simple lambda which adds events into an array.
This will become more apparent why when I show the code that hooks into Azure Functions.

```javascript
const eventCallback = (context, data, time) => {
    events.push({
        id: data.eventId,
        subject: data.deviceId,
        dataVersion: '1.0',
        eventType: data.capability,
        data: data,
        eventTime: time
    })
}
```

## Building the Azure Function

Azure functions are a serverless resource to implement backend of applications.
These can be things like APIs, scheduled jobs, event based processing, etc.
Being a serverless platform, the infrastructure underneath the application is something left for the cloud provider(Microsoft) to implement.

Depending on the usage of the function, it can scale up and down as necessary to meet demand.
There are ways to limit this consumption by setting up app service plans and limit it's compute resources.
However, for small projects where usage is metered by the number of executions, the default consumption based model is easier to use.
There is also a free bucket for a given number of executions of azure functions on a subscription.
So, for my use this will probably wind up free.

Again, for the Azure function, I will be using Node.js.
While I'm not a particular fan of Node.js, I'd much rather use .NET, but the SmartThings SDK is only available for Node.js and Java.
For workloads that are not compute constrained, Node.js is my choice over Java.

Building an Azure function is very simple in Node.js.
The module.exports just only needs to be defined as any async function.

```javascript
module.exports = async function (context, req) {
}
```

## Azure Function Bindings

In addition to the actual code some configuration needs to be set up for the function to define the trigger and bindings for the Azure function.
The Node.js based functions have a `function.json` file alongside it.
This defines several things for the runtime when it calls the function.

First is the trigger.
This defines what causes the function to run.
This could be a schedule, HTTP, some event, or a host of others.
In this case, I'm using an HTTP trigger.

Second is defining the bindings.
The bindings determine what can be used for inputs into or outputs from the function.
This could be a Comos DB input binding to take a parameter from the HTTP trigger and lookup a document.
Or- this could be an Event Grid binding to publish an event on an Event Grid topic as output of the function.

The beauty of the triggers and bindings is that the function runtime deals with most of the work to hook them up.
I don't really need to know much about Event Grid to hook it into my function, just some simple connection strings and a key.
Other than that, I just push an object to an array and specify it.
In the case of this application, I'm using an Event Grid Topic to output the events to.

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "eventGrid",
      "name": "outputEvent",
      "topicEndpointUri": "DeviceEventGridUri",
      "topicKeySetting": "DeviceEventGridKey",
      "direction": "out"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

Note in my `function.json` file for the Event Grid setup, I've got two setting names in the topicEndpointUri and topicKeySetting.
Those both need to be set in the function settings.

## Adding the SmartThings Code to the Azure Function

The final portion of all this is the actual code to integrate the SmartThings code above into the Azure Function.
initSmartApp is a function from earlier in the post that configures the SmartApp and it's lifecycle.
It takes an array and populates it with events based on the SmartThings event passed in vai the handleHttpCallbackUnverified.

For security, I am skipping the HTTP signature portion of the verification of the Samsung HTTP request.
This is because I am using function level authorization.
The handler I have set up in SmartThings has the key defined to call the application.

The bindings are referenced on `context.bindings` based on the property defined in the `function.json` file.
The events array passed into the builder gets placed on the outputEvent binding.
Those array elements are events that get posted to the Event Grid topic specified in the function settings for my function.

```javascript
module.exports = async function (context, req) {
  
  const events = []
  const smartApp = initSmartApp(events);
  
  await smartApp.handleHttpCallbackUnverified(req, context.res)
  
  context.bindings.outputEvent = events
}
```

## Wrapping Up

This was a fun project that I've wanted to do for a while.
I have a few SmartThings devices now registered via SmartApp on my phone.
The sensors I register fire events in my Azure Subscription that I can now use for further automation.
I have some personal goals around learning more in Azure this year, so I plan to do more with this project.

Between Azure Functions, and the SmartThings SDK it took very little code to actually get it working.
Check out the code on [GitHub here](https://github.com/jerhon/azure-functions-smart-things-webhook).
