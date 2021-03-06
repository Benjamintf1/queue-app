# `queue-app`

`queue-app` is a simple, easy-to-deploy web application to keep a queue of anything shared:

* Ping-pong tables (its original use case)
* Pool tables
* Laundry machines
* etc.

## Deploying

The front- and backend are deployed separately to a PaaS. The instructions below use [CloudFoundry](https://www.cloudfoundry.org/), but may also work with Heroku.

First, we need to customize and deploy the backend:

```console
$ cd backend
$ vim manifest.yml
...
    # Set this to the number of available tables/rooms/etc.
    RESOURCE_COUNT: 2
$ cf push
...
  routes:
+   pong-queue.mycf.example/backend
```

Then, point the frontend at your freshly deployed backend, and push it as well:

```console
$ cd ../frontend
$ vim manifest.yml
...
$ cf push
...
  routes:
+   pong-queue.mycf.example
```

Now, if you visit https://pong-queue.mycf.example, your queue should be up and running!

## Deploying on Kubernetes

If you want to deploy against kubernetes, you should first create a static global ip called `pong-ip` and a certificated called `tls-secret`. Then simply apply everything in the k8s folder(with modified env variables if needed) and point the dns toward the static ip that was allocated. 

## TODO
* Allow customization of branding (icon, colors, etc.)
* WebExtension
