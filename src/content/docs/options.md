---
title: "Configuration"
description: "Environment variables and options for configuring attic"
---

attic is configured using environment variables. This page lists all available options and explains how to use them.

## Using Options

### Docker Compose

Options are configured in the `.env` file alongside your `docker-compose.yml`. See the [installation guide](/installation) for an example `.env` file.

### Docker

Options are passed as environment variables using the `-e` flag:

```shell
docker run --name attic -p 8080:8080 \
  -e ATTIC_PORT=8080 \
  -e ATTIC_DATABASE_URL=postgres://attic:password@db:5432/attic?sslmode=disable \
  -d ghcr.io/lmmendes/attic:latest
```

## Server

### `ATTIC_PORT`

Values: `Integer` | Default: `8080`

The port the attic server listens on inside the container.

### `ATTIC_BASE_URL`

Values: `String` | Default: `http://localhost:8080`

The base URL of your attic instance. Used for generating callback URLs (e.g., OIDC redirects). Set this to your public-facing URL in production.

```
ATTIC_BASE_URL=https://attic.yourdomain.com
```

### `ATTIC_CORS_ORIGINS`

Values: `String` | Default: `http://localhost:3000`

Allowed CORS origins for API requests. Set this to your attic instance URL. Multiple origins can be separated by commas.

```
ATTIC_CORS_ORIGINS=https://attic.yourdomain.com
```

## Database

### `ATTIC_DATABASE_URL`

Values: `String` | Default: `postgres://attic:attic@localhost:5432/attic?sslmode=disable`

PostgreSQL connection string. When using Docker Compose, this is typically constructed from the `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` variables.

```
ATTIC_DATABASE_URL=postgres://user:password@host:5432/dbname?sslmode=disable
```

### `POSTGRES_USER`

Values: `String` | Default: `attic`

PostgreSQL username. Used by the PostgreSQL container and referenced in the database URL.

### `POSTGRES_PASSWORD`

Values: `String` | **Required**

PostgreSQL password. Use a strong, unique password in production.

### `POSTGRES_DB`

Values: `String` | Default: `attic`

PostgreSQL database name.

## Storage

attic supports two storage backends for file attachments: local filesystem and S3-compatible object storage. If S3 credentials are not provided, attic falls back to local storage.

### `ATTIC_LOCAL_STORAGE_PATH`

Values: `String` | Default: `./uploads`

Directory path for local file storage. In Docker, this should be set to a path inside a mounted volume (e.g., `/data/uploads`).

### `ATTIC_S3_ENDPOINT`

Values: `String` | Default: `http://localhost:4566`

S3-compatible storage endpoint URL.

```
# AWS S3
ATTIC_S3_ENDPOINT=https://s3.amazonaws.com

# MinIO
ATTIC_S3_ENDPOINT=https://minio.yourdomain.com

# Backblaze B2
ATTIC_S3_ENDPOINT=https://s3.us-west-000.backblazeb2.com
```

### `ATTIC_S3_BUCKET`

Values: `String` | Default: `attic-attachments`

Name of the S3 bucket to store attachments in. The bucket must already exist.

### `ATTIC_S3_REGION`

Values: `String` | Default: `us-east-1`

AWS region for the S3 bucket.

### `ATTIC_S3_ACCESS_KEY`

Values: `String` | Default: None

S3 access key. When left empty, attic uses local file storage instead.

### `ATTIC_S3_SECRET_KEY`

Values: `String` | Default: None

S3 secret key. When left empty, attic uses local file storage instead.

### `ATTIC_PUID`

Values: `Integer` | Default: None

User ID for local-storage ownership and root-start privilege dropping. Set together with `ATTIC_PGID`, using non-negative integers. When the entrypoint starts as root, it prepares the storage base directory and switches to the requested identity. This requires Compose `user: "0:0"` or Docker `--user 0:0` and permissions to change ownership and switch users.

The image defaults to non-root `1000:1000`. When already running non-root, these variables do not switch users: both must match the runtime UID/GID or startup fails. Leave them unset when selecting an identity through Docker's user setting or Kubernetes' security context. See [file permissions](/installation/#file-permissions-puidpgid).

```shell
# Find your UID
id -u
```

### `ATTIC_PGID`

Values: `Integer` | Default: None

Group ID for local-storage ownership and root-start privilege dropping. Set together with `ATTIC_PUID`; the same startup and identity-matching rules apply. These variables are ignored by the entrypoint when S3 storage is configured.

```shell
# Find your GID
id -g
```

## Authentication

attic supports three authentication modes: local password authentication, OIDC/SSO, or disabled (development only).

### `ATTIC_OIDC_ENABLED`

Values: `true`, `false` | Default: `false`

Enables OpenID Connect (OIDC) authentication for single sign-on. When enabled, users authenticate through your OIDC provider (e.g., Keycloak, Authentik, PocketID). See the [authentication guide](/guides/authentication) for setup instructions.

### `ATTIC_OIDC_AUTO_REDIRECT`

Values: `true`, `false` | Default: `false`

Automatically sends unauthenticated users to the configured OIDC provider instead of showing the intermediate SSO login button. This option only takes effect when `ATTIC_OIDC_ENABLED=true`. After an explicit logout, attic keeps users on the login page so they are not immediately signed in again.

### `ATTIC_OIDC_ISSUER_URL`

Values: `String` | Default: `http://localhost:8180/realms/attic`

The OIDC issuer URL. This is the base URL of your OIDC provider's realm or tenant.

```
# Keycloak
ATTIC_OIDC_ISSUER_URL=https://auth.yourdomain.com/realms/attic

# Authentik
ATTIC_OIDC_ISSUER_URL=https://auth.yourdomain.com/application/o/attic/

# PocketID
ATTIC_OIDC_ISSUER_URL=https://pocketid.yourdomain.com
```

### `ATTIC_OIDC_CLIENT_ID`

Values: `String` | Default: `attic-web`

The client ID registered with your OIDC provider.

### `ATTIC_OIDC_CLIENT_SECRET`

Values: `String` | Default: None

The client secret for confidential OIDC clients. Required when your OIDC provider is configured with a confidential client (as opposed to a public client). Leave empty for public clients.

### `ATTIC_AUTH_DISABLED`

Values: `true`, `false` | Default: `false`

Disables all authentication. **Only use this for local development.** All endpoints become accessible without login.

### `ATTIC_SESSION_SECRET`

Values: `String` | Default: `change-me-in-production-32chars!`

Secret key used to encrypt session cookies. **Must be changed in production.** Use at least 32 characters. Generate a secure value with:

```shell
openssl rand -base64 48
```

### `ATTIC_SESSION_DURATION_HOURS`

Values: `Integer` | Default: `24`

How long user sessions remain valid, in hours.

### `ATTIC_ADMIN_EMAIL`

Values: `String` | Default: `admin`

Email address for the initial admin user created on first startup. Does nothing if the user already exists.

### `ATTIC_ADMIN_PASSWORD`

Values: `String` | Default: `admin`

Password for the initial admin user. **Change this in production.**

### `ATTIC_PASSWORD_MIN_LENGTH`

Values: `Integer` | Default: `8`

Minimum password length for local authentication.

## Import Plugins

### `ATTIC_TMDB_API_KEY`

Values: `String` | Default: None

API key for [The Movie Database (TMDB)](https://www.themoviedb.org/). Required to use the TMDB import plugin for movies and TV series. Register for a free API key at [themoviedb.org](https://www.themoviedb.org/settings/api).
