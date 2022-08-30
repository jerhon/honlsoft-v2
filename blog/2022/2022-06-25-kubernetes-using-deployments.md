---
date: "2022-06-25"
title: "Kubernetes: Deployments"
tags: ["Containers", "Kubernetes", "Docker"]
type: "blog"
description: "Using deployments to scale workloads in Kubernetes.."
---

In my previous posts regarding Kubernetes, I've written primarily about running containers in Pods on Kubernetes.
Pods provide a basic building block in kubernetes that allows to execute containers within a Kubernetes cluster.
In future posts, I'm going to move on to other concepts that can be built off of Pods within Kubernetes.

ReplicaSets and Deployments will build off that base to help run scalable workloads.
Like Pods, there is a lot to discuss with the topic, this first post will be an introduction.
I will have further posts in the future which go into more detail about these topics.

## Redundancy and Scaling Application Workloads

Often times in software, additional instances of a service or application need to be brought up.
There are several reasons for this including:
* Scaling an application workload for additional users
* Application redundancy in case a single instance of the application crashes or is unreliable
* Disaster recovery

Being able to respond to these changes quickly can make the difference between a great and a poor customer experience.

Deployments and ReplicaSets in Kubernetes provide the foundation to take a Pod and to have it run as multiple instances.
Once a workload is containerized, and given there are enough resources in the Kubernetes makes scaling Pods horizontally as part of these resources simple.

## Deployment

In short, a Deployment is used to manage a group of Pods and rollout or decommission additional instances of them based on scale or configuration changes.

A Deployment in Kubernetes does this by creating new ReplicaSets.
A ReplicaSet is another object in Kubernetes which creates multiple instances of a Pod based on a specification.
A Deployment uses the ReplicaSets to migrate between states of the application deployment.

It's important to know ReplicaSets are there and just understand they let us run multiple instances of a Pod.
However, for the sake of my blog, I'm not going to go into details of how to manually create ReplicaSets.
I'll show them in some of the calls in Kubernetes, but that's it.

### Definition of a Deployment

A Deployment usually contains several basic pieces of information

1. How to create the Pods from a template.  This is usually defined inline in the Deployment yaml.
2. How many instances of the Pod to create
3. A strategy for how to deal with updates to the deployment and Pod specification. 

### The Template and Number of Instances (Replicas)

The template for the Pod in the deployment isn't much different from a regular Pod.
In the yaml for a Deployment, the Pod specification can be included.
This contains most of the same information as a plain Pod specification.

The replica count is the number of instances of the Pod to have in the deployment.
The number defined will be the number of Pods that are running in the deployment.
If I chose 3, the Deployment will work to maintain 3 instances of that Pod.

### Deployment Strategies

This is where things get fascinating in Deployments.
Deployments allow configuration changes in Pods that are running in a cluster.
A common use case is changing what container image is run as for the Pod in a deployment.
For example, I have v1 of an application and wish to update the deployment to run v2.
This is easily accomplished by updating the image run in the Pod tied to the deployment specification.

Strategies in Deployments define how these types of changes are applied to the deployment.

Using the default strategy, the rolling strategy, the Deployment will create a new replica set.
It will scale up the new ReplicaSet with new Pods, and scale down the old replica set as Pods become available.
As the new Pods come online and become healthy, it will terminate the old Pods.
In this way with the right settings, we can achieve simple zero down-time deployments in the application.
The application is always running even when it is transition between configuration states.

This is also where our probes come into play as Kubernetes uses these to determine the health of the Pods.
If a probe were to fail so that the Pod wouldn't successfully, Kubernetes would still have the old nodes available.

While I mentioned updating the image, this really is applicable for many changes to the Pod configuration.
I'll give a simple example of one such configuration.
Changing the command that is run inside the container.

## Example: An HTTP Server in a Deployment

Here's a simple example of an HTTP server in a Deployment.
I modified the startup command on the Pod so that when it would start up it would write its hostname to a text file which the HTTP server will serve.
Once it's running, I can go to the path /host.txt and there will be a text file with the hostname of the server.

I created a namespace "deployment-example" to put all the resources in.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: deployment-example
  labels:
    app: caddy-app
  name: caddy-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: caddy-app
  template:
    metadata:
      labels:
        app: caddy-app
    spec:
      containers:
      - image: caddy
        name: caddy-server
        ports:
          - containerPort: 80
            name: http
            protocol: TCP
        command:
          - /bin/sh
          - -c
          - hostname > /usr/share/caddy/host.txt;
            caddy run --config /etc/caddy/Caddyfile --adapter caddyfile;
```

In order to be able to route to the Deployment, I need to create a service in Kubernetes.
I will talk about Networking in more depth in future posts.
In Docker Desktop this will expose the application on localhost:5678 and load balance the traffic across the Pods.
Thus, the full path to the `host.txt` is http://localhost:5678/host.txt once both have been applied.

The behavior of this service will be different depending on what and how your cluster sets up a load balancer.

```yaml
apiVersion: v1
kind: Service
metadata:
  namespace: deployment-example
  labels:
    app: caddy-app
  name: caddy-app-service
spec:
  ports:
    - name: 5678-80
      port: 5678
      protocol: TCP
      targetPort: 80
  selector:
    app: caddy-app
  type: LoadBalancer
```

### Inspecting the Deployment

After applying the deployment, we can see the 3 Pods, a service, a deployment, and the underlying replicaset.

```
> k get all --namespace=deployment-example
NAME                             READY   STATUS    RESTARTS   AGE
pod/caddy-app-788fd54dbd-2qvhw   1/1     Running   0          38s
pod/caddy-app-788fd54dbd-4sbj7   1/1     Running   0          38s
pod/caddy-app-788fd54dbd-z2wfv   1/1     Running   0          38s

NAME                        TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
service/caddy-app-service   LoadBalancer   10.109.242.49   localhost     5678:32472/TCP   38s

NAME                        READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/caddy-app   3/3     3            3           38s

NAME                                   DESIRED   CURRENT   READY   AGE
replicaset.apps/caddy-app-788fd54dbd   3         3         3       38s
```

### Scaling Down the Deployment

Scaling a deployment up or down can be done by modifying the replicas in the yaml and re-applying it or doing it via the scale command.

```
> k scale deployment/caddy-app --replicas=2 --namespace=deployment-example 
deployment.apps/caddy-app scaled
```

Care should be taken when using the command.
If the YAML is reapplied after this command, the deployment would scale back up to 3 instances.

There are now only two Pods.
Here are the to the Pods in the example, there is one less.
Note that Kubernetes simply changed the number of Pods in the ReplicaSet.

```
> k get all --namespace=deployment-example
NAME                             READY   STATUS    RESTARTS   AGE
pod/caddy-app-788fd54dbd-4sbj7   1/1     Running   0          14m
pod/caddy-app-788fd54dbd-z2wfv   1/1     Running   0          14m

NAME                        TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
service/caddy-app-service   LoadBalancer   10.109.242.49   localhost     5678:32472/TCP   14m

NAME                        READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/caddy-app   2/2     2            2           14m

NAME                                   DESIRED   CURRENT   READY   AGE
replicaset.apps/caddy-app-788fd54dbd   2         2         2       14m
```

### Changing the Pod Configuration

I'm going to change the Pod configuration so that in the `host.txt` file, it writes "Hello, I'm pod " prior to the hostname.
In the container spec, the command will just change to output more to the host.txt file.

Here's the new command:

```yaml
        command:
          - /bin/sh
          - -c
          - echo "Hello, I'm pod " > /usr/share/caddy/host.txt;
            hostname >> /usr/share/caddy/host.txt;
            caddy run --config /etc/caddy/Caddyfile --adapter caddyfile;
```

When I apply the new changes, the command indicates the Deployment has been configured:

```
> k apply -f .\nginx-deployment.yaml
deployment.apps/caddy-app configured
```

Looking at the resources in the sample namespace, a new ReplicaSet was created and it is managing 3 pods.

```
> k get all --namespace=deployment-example
NAME                             READY   STATUS    RESTARTS   AGE
pod/caddy-app-597ff574df-bcs99   1/1     Running   0          56s
pod/caddy-app-597ff574df-hkqhw   1/1     Running   0          45s
pod/caddy-app-597ff574df-xgmmp   1/1     Running   0          49s

NAME                        TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
service/caddy-app-service   LoadBalancer   10.109.242.49   localhost     5678:32472/TCP   23m

NAME                        READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/caddy-app   3/3     3            3           23m

NAME                                   DESIRED   CURRENT   READY   AGE
replicaset.apps/caddy-app-597ff574df   3         3         3       56s
replicaset.apps/caddy-app-788fd54dbd   0         0         0       23m
```

Kubernetes shut down the old Pods, and in the new replica set has set up the 3 new Pods.
This happened fairly quickly so, I haven't captured the process step by step here.
However, the age in the Pods show that the new Pods were stood up one after the other.

In this case the deployment was standing up new Pods, and taking down old Pods in the old ReplicaSet after scaling up the Pods in the new ReplicaSet.

## Rollout Commands

Another way to view the status and modify a rollout is with the `kubectl rollout` command.
This includes use cases such as rolling back a deployment to a previous version, checking the status, and seeing the history of a deployment.
There are a lot of options here.
I'd suggest just going through the help documentation on that command as it can be useful in addition to just making changes through `kubectl apply -f`

## Kubernetes Makes it Easy to Scale Horizontally

Consider what was just done on the command line versus the amount of work needed to scale a workload. 
In a traditional environment.
1. I need to procure the server or VM
2. I need to set up the server with all the application dependencies
3. I need to download and install the application
4. I to configure the application
5. I can run the application.
6. I need to modify the load balancer to balance traffic to the application.
7. Repeat for each new instance.
8. Maybe automate each of these steps if this happens commonly?

I'm probably missing a few steps.

In Kubernetes, creating workloads that scale is a process that is baked in.
All I had to do was create a few Kubernetes resources and run a few commands through the Kubernetes API, and I could easily do this.
This doesn't negate the need to add additional nodes in the cluster to support additional workloads, but the process is more standardized for adding Kubernetes node.
Add a Kubernetes node at anytime to scale the cluster- it typically doesn't have any workload specific dependencies.

## Wrapping Up

By running a properly architected software solution in a Kubernetes cluster, it can increase the agility of an enterprise to respond to scale in an application. 

I hope as I progress through more advanced use cases in Kubernetes, it's benefits will continue to become clear.
I will go into other considerations and use cases around Pods and Deployments in future posts.
