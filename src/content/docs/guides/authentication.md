---
title: "Authentication"
description: "Set up authentication for attic using local passwords or OIDC/SSO"
---

attic supports two authentication methods: local password authentication and OpenID Connect (OIDC) for single sign-on. You can also disable authentication entirely for development.

## Local Authentication (Default)

Local authentication is enabled by default. Users are managed directly within attic and authenticate with an email and password.

On first startup, attic creates an admin user using the `ATTIC_ADMIN_EMAIL` and `ATTIC_ADMIN_PASSWORD` environment variables:

```shell
ATTIC_ADMIN_EMAIL=admin@example.com
ATTIC_ADMIN_PASSWORD=your-secure-password
```

Admin users can create additional users through the Settings page in the web interface.

### Password Reset

If you lose access to an account, reset the password using the CLI:

```shell
# Docker Compose
docker compose exec attic /app/attic --reset-password --email admin@example.com --new-password new-secure-password

# Docker
docker exec -it attic /app/attic --reset-password --email admin@example.com --new-password new-secure-password
```

### Password Policy

The minimum password length defaults to 8 characters and can be configured with `ATTIC_PASSWORD_MIN_LENGTH`.

## OIDC / Single Sign-On

attic supports any OpenID Connect (OIDC) provider for SSO, including Keycloak, Authentik, PocketID, Authelia, and others.

When OIDC is enabled, users authenticate through your identity provider. New users are automatically created in attic on their first login.

### Basic OIDC Setup

Add these environment variables to enable OIDC:

```shell
ATTIC_OIDC_ENABLED=true
ATTIC_OIDC_ISSUER_URL=https://auth.yourdomain.com/realms/attic
ATTIC_OIDC_CLIENT_ID=attic-web
ATTIC_OIDC_CLIENT_SECRET=your-client-secret  # Required for confidential clients
ATTIC_BASE_URL=https://attic.yourdomain.com
```

If your OIDC provider uses a public client (no secret required), you can omit `ATTIC_OIDC_CLIENT_SECRET`.

To skip the intermediate SSO login button and send unauthenticated users directly to your identity provider, enable automatic OIDC forwarding:

```shell
ATTIC_OIDC_AUTO_REDIRECT=true
```

This setting is opt-in and only applies when OIDC is enabled. After an explicit logout, attic remains on the login page instead of automatically redirecting back to the identity provider.

The callback URL to configure in your OIDC provider is:

```
https://attic.yourdomain.com/auth/oidc/callback
```

### Keycloak Setup

The Docker Compose file includes a bundled Keycloak instance. To use it:

**1. Add Keycloak configuration to your `.env`:**

```shell
ATTIC_OIDC_ENABLED=true
ATTIC_OIDC_ISSUER_URL=https://auth.yourdomain.com/realms/attic
ATTIC_OIDC_CLIENT_ID=attic-web
ATTIC_OIDC_CLIENT_SECRET=your-client-secret

KEYCLOAK_HOSTNAME=auth.yourdomain.com
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=your-keycloak-admin-password
```

**2. Add the Keycloak service to your `docker-compose.yml`:**

```yaml
keycloak:
  image: quay.io/keycloak/keycloak:26.0
  command: start --optimized
  environment:
    KC_DB: postgres
    KC_DB_URL: jdbc:postgresql://postgres:5432/${KEYCLOAK_DB:-keycloak}
    KC_DB_USERNAME: ${POSTGRES_USER:-attic}
    KC_DB_PASSWORD: ${POSTGRES_PASSWORD}
    KC_HOSTNAME: ${KEYCLOAK_HOSTNAME}
    KC_HOSTNAME_STRICT: "false"
    KC_HTTP_ENABLED: "true"
    KEYCLOAK_ADMIN: ${KEYCLOAK_ADMIN:-admin}
    KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD}
  ports:
    - "8180:8080"
  depends_on:
    postgres:
      condition: service_healthy
  restart: unless-stopped
```

**3. Configure the Keycloak realm:**

1. Log in to the Keycloak admin console at `https://auth.yourdomain.com`
2. Create a new realm named `attic`
3. Create a client:
   - **Client ID**: `attic-web`
   - **Client Protocol**: `openid-connect`
   - **Client authentication**: On (confidential client)
   - **Root URL**: `https://attic.yourdomain.com`
   - **Valid redirect URIs**: `https://attic.yourdomain.com/auth/oidc/callback`
   - **Web origins**: `https://attic.yourdomain.com`
4. Copy the client secret from the **Credentials** tab and set it as `ATTIC_OIDC_CLIENT_SECRET`
5. Create users in the realm as needed

### PocketID Setup

[PocketID](https://github.com/pocket-id/pocket-id) is a lightweight OIDC provider that works well with attic.

```shell
ATTIC_OIDC_ENABLED=true
ATTIC_OIDC_ISSUER_URL=https://pocketid.yourdomain.com
ATTIC_OIDC_CLIENT_ID=your-client-id
ATTIC_OIDC_CLIENT_SECRET=your-client-secret
```

In PocketID, create a new client with the redirect URI set to `https://attic.yourdomain.com/auth/oidc/callback` and copy the generated client secret.

### Authentik Setup

```shell
ATTIC_OIDC_ENABLED=true
ATTIC_OIDC_ISSUER_URL=https://auth.yourdomain.com/application/o/attic/
ATTIC_OIDC_CLIENT_ID=your-client-id
ATTIC_OIDC_CLIENT_SECRET=your-client-secret
```

In Authentik, create a new OAuth2/OpenID provider and application with the redirect URI set to `https://attic.yourdomain.com/auth/oidc/callback`. Copy the client secret from the provider settings.

## Session Configuration

### Session Duration

Sessions are valid for 24 hours by default. Change this with:

```shell
ATTIC_SESSION_DURATION_HOURS=72
```

### Session Secret

The session secret encrypts session cookies. Generate a secure value for production:

```shell
openssl rand -base64 48
```

Set it with:

```shell
ATTIC_SESSION_SECRET=your-generated-secret-here
```

## Disabling Authentication

For local development only, you can disable authentication entirely:

```shell
ATTIC_AUTH_DISABLED=true
```

**Never use this in production.** All endpoints become accessible without login.
