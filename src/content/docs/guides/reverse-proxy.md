---
title: "Reverse Proxy"
description: "Set up a reverse proxy for attic with Nginx, Caddy, or Traefik"
---

In production, you should run attic behind a reverse proxy to handle TLS/HTTPS termination and expose it on a clean domain. This guide covers configuration for common reverse proxy solutions.

When using a reverse proxy, set the `ATTIC_BASE_URL` to your public-facing URL:

```shell
ATTIC_BASE_URL=https://attic.yourdomain.com
ATTIC_CORS_ORIGINS=https://attic.yourdomain.com
```

## Caddy

[Caddy](https://caddyserver.com/) is the simplest option as it handles TLS certificates automatically.

### Caddyfile

```
attic.yourdomain.com {
    reverse_proxy attic:8080
}
```

### Docker Compose

```yaml
caddy:
  image: caddy:2-alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./Caddyfile:/etc/caddy/Caddyfile
    - caddy_data:/data
    - caddy_config:/config
  restart: unless-stopped
```

If you're also running Keycloak for OIDC:

```
attic.yourdomain.com {
    reverse_proxy attic:8080
}

auth.yourdomain.com {
    reverse_proxy keycloak:8080
}
```

## Nginx

### Configuration

```nginx
server {
    listen 80;
    server_name attic.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name attic.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    client_max_body_size 100M;

    location / {
        proxy_pass http://attic:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

The `client_max_body_size` directive controls the maximum upload size. Adjust this value based on the size of attachments you expect users to upload.

### Docker Compose

```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/conf.d/default.conf
    - /path/to/certs:/etc/nginx/certs
  restart: unless-stopped
```

## Traefik

### Docker Compose Labels

Add labels to your attic service to configure Traefik:

```yaml
services:
  attic:
    image: ghcr.io/lmmendes/attic:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.attic.rule=Host(`attic.yourdomain.com`)"
      - "traefik.http.routers.attic.entrypoints=websecure"
      - "traefik.http.routers.attic.tls.certresolver=letsencrypt"
      - "traefik.http.services.attic.loadbalancer.server.port=8080"
```

### Traefik Configuration

```yaml
traefik:
  image: traefik:v3.0
  command:
    - "--providers.docker=true"
    - "--providers.docker.exposedByDefault=false"
    - "--entrypoints.web.address=:80"
    - "--entrypoints.websecure.address=:443"
    - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
    - "--certificatesresolvers.letsencrypt.acme.email=you@yourdomain.com"
    - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock:ro
    - traefik_letsencrypt:/letsencrypt
  restart: unless-stopped
```

## Nginx Proxy Manager

[Nginx Proxy Manager](https://nginxproxymanager.com/) provides a web UI for managing reverse proxy configurations.

1. Add a new proxy host
2. Set the domain to `attic.yourdomain.com`
3. Set the forward hostname to `attic` (or the container name)
4. Set the forward port to `8080`
5. Enable "Block Common Exploits"
6. In the SSL tab, request a new SSL certificate with "Force SSL"

## Subpath Deployment

attic does not currently support running under a URL subpath (e.g., `yourdomain.com/attic`). It must be deployed at the root of a domain or subdomain.
