---
date: "2022-06-17"
title: "Kubernetes: Checking Pod Health"
tags: ["containers", "kubernetes", "docker-desktop"]
type: "blog"
description: "A brief introduction to building and running containers in Kubernetes with Docker Desktop."
---

In my [previous post on Pods](2022-06-03-kubernetes-running-containers-in-pods), I gave a simple example running a container in Kubernetes.
In this post, I will be discussing Pod lifecycles and how to check Pod health and keep them running.

## Probes on Pods

Even the best software fails from time to time.
Be it networking issues, a software bug, or unrelated 3rd party dependencies.
Being able to react to these failures and ensure the appropriate action occurs is critical to maintaining an overall healthy software system.

Kubernetes has probes to inspect a Pod to ensure it is up, running, and healthy.
Depending on the type of probe, it may stop directing traffic to the pod or terminate the pod.

There are three main probes on the Pods: 
* Startup Probe
* Readiness Probe
* Liveness Probe

### The Startup Probe

The startup probe is to determine when a container is done starting and ready to begin processing.
This affects the system as a pod that is not `Ready` won't be available for network traffic yet.

The startup probe inspects a Pod and ensures a condition is met prior to considering the Pod ready.
If the startup probe fails it will stop the pod.
The restart policy will take effect and the pod will be restarted if so configured.
Many pieces of software will have some initialization routine, or need to prepare some resources before they can be considered ready to use.

The startup probe may seem redundant with the liveness probe.
The two are very similar.
However, the main reasoning for the startup probe is that certain applications take longer to startup.
An example would be an application that performs database migrations on startup.
That initial database migration may take a long time.
However, it's a one time cost at the start of the application.
Once it's are in a running state inspecting if they are still working is a faster operation.

### The Liveness Probe

The liveness probe executes as the pod is running.
It will intermittently check that the Pod is still healthy, if it is not, Kubernetes will terminate the container and restart it via it's configured restart policy.
Where the startup probe was just when the container starts up, the liveness probe is the probe that handles checks after the container was initially ready.

### The Readiness Probe

This one is perhaps the coolest probe.
In the same way as the other probes, the Readiness probe inspects the Pod for health.
However, this probe doesn't terminate the pod.
If the probe indicates the container is not healthy, it will take it out of any service end points.
In other words - traffic will stop routing to the Pod, but the Pod will remain running.

I haven't talked about networking in Kubernetes yet, but plan to in the future.

### Options on The Probes

The probes can consist of one of the following:
* A command executed within the Pod
* An HTTP GET request
* A TCP port check
* A [GRPC health check](https://github.com/grpc/grpc/blob/master/doc/health-checking.md)

I can set a startup probe which will wait for the Pod to become available until a TCP port is available.
Another example would be a liveness probe including an HTTP endpoint on my application which indicates the Pod is healthy.
The liveness probe could continue to run and check the endpoint through an HTTP GET request.

Other options include but aren't limited to.
* How often the probe runs.
* How many times the probe needs to fail.
* How many times it needs to succeed to have traffic routed to it again (for a readiness probe).


## Example #1: The Startup Probe

For my first sample, I'm going to setup a Pod, which will wait for 15 seconds and then write a file to disk.
A startup probe based on an exec command which will check for that file to be written, that will check every 5 seconds and do up to 12 checks.
The probe will be an exec command that will check for the file to exist on disk.
The cat command will return a non-success return code if the file doesn't exist and the exec command will pick up on the return code.
After that, Kubernetes should show the Pod as running.

To run the pod, I will just setup a YAML resource and use `kubectl apply` to apply it to the cluster.

Here's the YAML I'll be using for this example:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox-startup-exec-probe
spec:
  containers:
  - image: busybox
    command: ["/bin/sh"]
    args:
      - -c
      - echo "started";
        sleep 15;
        echo "touching startup file";
        touch ~/startup;
        echo "sleeping before restart";
        sleep 120;
    name: busybox-startup-exec-probe
    startupProbe:
      exec:
        command:
          - /bin/sh
          - -c
          - cat ~/startup
      periodSeconds: 5
      failureThreshold: 12
  restartPolicy: Always
```

### Watching the Status

To see the status of the pod, the 'describe' command can be used as it starts up.
There is a lot of information that comes back in describe, so I'm only going to highlight a few parts I'm interested in.

A few seconds after starting the container, I ran the `kubectl describe pod/busybox-startup-exec-probe` command to look at the status.
There are a few things to note here.
The container indicates it is Running.
However, in the conditions you can see that the containers aren't Ready yet.
This is because the startup probe has been failing.
There is a separate Events section which shows us the actions Kuberenetes is taking against the Pod. 

The event I want to point out is the final line.
This indicates that the pod is unhealthy because the startup probe failed multiple times.
This is due to the file not existing immediately after the Pod started running.
The message section gives these details.


```
Name:         busybox-startup-exec-probe
Status:       Running
Containers:
  busybox-startup-exec-probe:
    State:          Running
      Started:      Sat, 18 Jun 2022 10:14:43 -0500
    Ready:          False
Conditions:
  Type              Status
  Initialized       True
  Ready             False
  ContainersReady   False
  PodScheduled      True
Events:
  Type     Reason     Age              From               Message
  ----     ------     ----             ----               -------
  Normal   Scheduled  13s              default-scheduler  Successfully assigned default/busybox-startup-exec-probe to docker-desktop
  Normal   Pulling    13s              kubelet            Pulling image "busybox"
  Normal   Pulled     11s              kubelet            Successfully pulled image "busybox" in 1.2569084s
  Normal   Created    11s              kubelet            Created container busybox-startup-exec-probe
  Normal   Started    11s              kubelet            Started container busybox-startup-exec-probe
  Warning  Unhealthy  3s (x2 over 8s)  kubelet            Startup probe failed: cat: can't open '/root/startup': No such file or directory
```

After running for some time, I again run the command to describe the Pod.
From the events, we can see no more Unhealthy events popped up after a while.
It had 3 events, and is no longer logging new ones.
The pod is now in a Ready state.
The startup probe did its job.

```
Name:         busybox-startup-exec-probe
Containers:
  busybox-startup-exec-probe:
    State:          Running
      Started:      Sat, 18 Jun 2022 10:14:43 -0500
    Ready:          True
Conditions:
  Type              Status
  Initialized       True
  Ready             True
  ContainersReady   True
  PodScheduled      True

Events:
  Type     Reason     Age                  From               Message
  ----     ------     ----                 ----               -------
  Normal   Scheduled  2m6s                 default-scheduler  Successfully assigned default/busybox-startup-exec-probe to docker-desktop
  Normal   Pulling    2m6s                 kubelet            Pulling image "busybox"
  Normal   Pulled     2m4s                 kubelet            Successfully pulled image "busybox" in 1.2569084s
  Normal   Created    2m4s                 kubelet            Created container busybox-startup-exec-probe
  Normal   Started    2m4s                 kubelet            Started container busybox-startup-exec-probe
  Warning  Unhealthy  111s (x3 over 2m1s)  kubelet            Startup probe failed: cat: can't open '/root/startup': No such file or directory
```


## Example #2: The Liveness Probe

I'm going to modify my previous example.
I will setup a liveness probe which will run the same exec command.
I'm going to modify my pod so that after another 30 seconds, it will delete the file.

The result should be, the Pod will start, the startup probe will succeed when the file is there.
The liveness probe will fail and will restart the container.
The liveness probe will be set to check every second, and after 1 failure, it will terminate the container.
Due to the Always restart policy, the container will be restarted.

Here is the yaml describing the Pod.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox-liveness-exec-probe
spec:
  containers:
  - image: busybox
    command: ["/bin/sh"]
    args:
      - -c
      - echo "started";
        sleep 15;
        echo "touching startup file";
        touch ~/startup;
        echo "waiting for 15 seconds and then deleting file";
        sleep 15;
        echo "deleting file";
        rm ~/startup;
        echo "sleeping before restart";
        sleep 120;
    name: busybox-liveness-exec-probe
    startupProbe:
      exec:
        command:
          - /bin/sh
          - -c
          - cat ~/startup
      periodSeconds: 5
      failureThreshold: 12
    livenessProbe:
      exec:
        command:
          - /bin/sh
          - -c
          - cat ~/startup
      periodSeconds: 1
      failureThreshold: 1
  restartPolicy: Always
```

Rather than monitoring the pod with the describe command, I'm going to look at the raw events for the pod.

I can do that by using a `k get events --field-selector=involvedObject.name=busybox-liveness-exec-probe` command.
The field selector parameter is powerful in that it lets me reduce the list of messages to the ones just for my pod.

```
LAST SEEN   TYPE      REASON      OBJECT                            MESSAGE
58s         Normal    Scheduled   pod/busybox-liveness-exec-probe   Successfully assigned default/busybox-liveness-exec-probe to docker-desktop
57s         Normal    Pulling     pod/busybox-liveness-exec-probe   Pulling image "busybox"
53s         Normal    Pulled      pod/busybox-liveness-exec-probe   Successfully pulled image "busybox" in 4.3484866s
52s         Normal    Created     pod/busybox-liveness-exec-probe   Created container busybox-liveness-exec-probe
52s         Normal    Started     pod/busybox-liveness-exec-probe   Started container busybox-liveness-exec-probe
38s         Warning   Unhealthy   pod/busybox-liveness-exec-probe   Startup probe failed: cat: can't open '/root/startup': No such file or directory
22s         Warning   Unhealthy   pod/busybox-liveness-exec-probe   Liveness probe failed: cat: can't open '/root/startup': No such file or directory
22s         Normal    Killing     pod/busybox-liveness-exec-probe   Container busybox-liveness-exec-probe failed liveness probe, will be restarted
```

If I kept checking the events, I'd see this repeat again as the container will just keep getting restarted.
I will spare the details for the describe command here.

### Wrapping Up

Through probes, Kubernetes provides a way to inspect containers in pods to ensure they are still healthy.
Having functionality like this baked into the orchestrator helps build automation for heath checks around even the most basic use cases.
It also makes it very easy to configure.

I've started a GitHub repository with various examples as I write more blogs about Kubernetes.
[The YAML files for my examples from above can be found here.](https://github.com/jerhon/kubernetes-examples/tree/main/probes)

I hope you enjoyed this post, and it will encourage you to configure some probes on the next Kubernetes pod you create!

