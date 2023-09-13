# Reverse Proxy with Docker Compose

The `hubmap.yml` here is used to deploy to
[portal.test.hubmapconsortium.org](https://portal.test.hubmapconsortium.org/),
[portal.dev.hubmapconsortium.org](https://portal.dev.hubmapconsortium.org/),
and [portal.hubmapconsortium.org](https://portal.hubmapconsortium.org/);
The other files are just for demonstration.

The `docker-compose.yml` here provides a local demonstration of how the NGINX reverse proxy works in real deployments.
(The _real_ NGINX configuration for deployment is [here](https://github.com/hubmapconsortium/gateway/blob/master/nginx/conf.d-test/portal-ui.conf).)
The important part is this line in `nginx.conf`:

```
proxy_set_header  Host $http_host;
```

Without this, the app would still respond, but the redirect URL passed to
Globus would be the internal name (`portal-ui`), rather than the external domain name (`portal.hubmapconsortium.org`, for example).

You'll need:

- [Docker Compose](https://docs.docker.com/compose/install/) installed.
- Valid Globus credentials in `context/instance/app.conf`.
- Nothing already using port 5000.

With that ready:

```
cd compose
docker-compose up
```

and the portal will be available at http://localhost:5000/, behind the reverse proxy.
