---
date: "2023-01-07"
title: "Kubernetes: Using ConfigMaps to Manage Application Configuration"
tags: ["Containers", "Kubernetes", "ConfigMap"]
type: "blog"
description: "This blog post explores how to use Kubernetes ConfigMaps to manage application configuration. It covers creating ConfigMaps using imperative commands and YAML definitions, and demonstrates their usage in Pods. Examples include setting environment variables and mounting ConfigMaps as files."
---

Most applications contain settings which differ from environment to environment, or just need to be able to have behavior changed without making changes to the code.
Configuration allows applications to do this.

Thankfully, Kubernetes provides a simple way to store configuration values in a cluster and reference them in a Pod specification.
In this blog post, I'll show some simple examples of using ConfigMaps in Kubernetes.

## What Are ConfigMaps

ConfigMaps are resources in Kubernetes.
So, to use a configmap, it needs to be created through its API.
As I have shown in previous examples with Kubernetes there are two primary ways to create resources and both work here with ConfigMaps.

First is imperatively through the CLI with the `kubectl create configmap` command, and the second is declarative through a YAML resource definition.

In this post I'll be using the imperative commands, and showing the corresponding resources which could be used to create the same resources.

## ConfigMaps from the CommandLine

There are a few different ways to create ConfigMaps.
I will highlight three of these.

* From a raw file or directory
* From a literal value
* From an env file

When I create the ConfigMap from the Command Line, I will also show the corresponding resource created using `kubectl get`.
This will show what the resource should look like if I were adding it directly through a `kubectl apply -f` or `kubectl create -f` command.

## Create a Config Map from a Literal Value

First I'll create a configmap that has two literal values in it.

```bash
kubectl create configmap literal-cfg --from-literal=name=Jeremy --from-literal=hello=universe```
```

Let's output the ConfigMap as a resource to see what it contains.
The corresponding resource for the ConfigMap looks like this:

```
apiVersion: v1
data:
  hello: universe
  name: Jeremy
kind: ConfigMap
```

A ConfigMap can be created from a file or directory using the `--from-file` options. For example, the following command will create a ConfigMap from the config.txt file:

### Create a Config Map from a File

```
kubectl create configmap file-cfg --from-file=config.txt
```

Each file provided maps to a key in the resource.
The resource for the created config map looks like this:

```
> kubectl get configmap/file-cfg -o yaml
apiVersion: v1
data:
  data.txt: "config-map-data\r\nwith multiple lines"
kind: ConfigMap
```

The `--from-file` parameter also works on directories.
For directories, each file name becomes a key, and the contents of the file become the value under the data section of the resource. 

### Create a Config Map from a .env File

Many applications use environment variables as a way to easily set configuration at runtime.
So having an easy way to go from a .env file to a config map can help those types of applications.

```bash
kubectl create configmap env-cfg --from-env-file=sample.env
```

The file `sample.env` has these contents like this:

```
hello=world
name=jeremy
```

Looking at the resource, each key in the .env file translated to a corresponding key under the ConfigMap data.

The resulting resource looks like this:

```
apiVersion: v1
data:
  hello: world
  name: jeremy
kind: ConfigMap
```

## Using the Config Values

So, I've been able to create a set of config values in Kubernetes, the next step is using those values.
In pod specifications, there are multiple options to specify the configuration values.

I'm going to show two examples.
First is using a value from a ConfigMap as an environment variable, the second mounting it as a file.

### Using a Config Map Value as an Environment Variable

In this example, I'm going to create a single YAML file which sets up a config map and also a Pod.
The Pod will reference the config map and output the environment variable value.

The key section is the `envFrom:` section in the Pod specification.
It specifies a `configMapRef` which is referenced to get the values for the environment.
The Pod will run a bash command which will output the current values of the environment variables.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: config-map-example-ns
  name: config-map-example
data:
  env_var1: VALUE1
  env_var2: VALUE2
---
apiVersion: v1
kind: Pod
metadata:
  namespace: config-map-example-ns
  labels:
    run: busybox-env-list
  name: busybox-env-list
spec:
  containers:
  - image: busybox
    command: ["/bin/sh"]
    args:
      - -c
      - "echo \"env_var1: $env_var1\"  env_var2: \"$env_var2\""
    name: env-list
    envFrom:
    - configMapRef:
      name: config-map-example
  restartPolicy: Never
```

Here is the output of the Pod.
Both the environment values were output as expected.

```
> k logs pod/busybox-env-list --namespace=config-map-example-ns
env_var1: VALUE1 env_var2: VALUE2
```

### Mounting a ConfigMap as a File in a Pod

The final example will be mounting a ConfigMap as files inside the Pod.
Note the `volumes` section with a `configMap` defining a ConfigMap as a volume.
The `volumeMounts` section then refers to that volume by name.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: config-map-example-ns
  name: config-map-example
data:
  env_var1: VALUE1
  env_var2: VALUE2
---
apiVersion: v1
kind: Pod
metadata:
  namespace: config-map-example-ns
  name: config-map-vol-pod
spec:
  containers:
  - image: busybox
    command: ["/bin/sh"]
    args:
      - -c
      - "ls -l /app/config; cat /app/config/env_var1; cat /app/config/env_var2;"
    name: env-list
    volumeMounts:
      - name: config-map-vol
        mountPath: /app/config
        readOnly: true
  volumes:
    - name: config-map-vol
      configMap:
        name: config-map-example
  restartPolicy: Never
```

After running a `kubectl apply`, and grabbing the logs, this was the output.

```
> k logs pod/config-map-vol-pod --namespace=config-map-example-ns
total 0
lrwxrwxrwx    1 root     root            15 Jan  7 22:52 env_var1 -> ..data/env_var1
lrwxrwxrwx    1 root     root            15 Jan  7 22:52 env_var2 -> ..data/env_var2
VALUE1VALUE2
```

It shows the file listing for the directory containing the config map.
It has a file for each key in the original ConfigMap.
The contents of the files contains the values from the ConfigMap.

## Wrapping Up

I've shown a few examples of using a ConfigMap in Kubernetes to inject configuration within a Pod.
By using ConfigMaps, the configuration can live alongside the Pod or Deployment definition which is extremely useful maintaining differences between environments.
By having this construct built in it makes it much easier to manage configuration especially across different instances of an application being run.
