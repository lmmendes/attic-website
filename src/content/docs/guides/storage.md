---
title: "Storage"
description: "Configure local or S3-compatible storage for file attachments"
---

attic supports two storage backends for file attachments: local filesystem storage and S3-compatible object storage. If no S3 credentials are configured, attic automatically uses local storage.

## Local Storage (Default)

Local storage saves uploaded files directly to the filesystem. This is the simplest option and requires no additional services.

### Configuration

```shell
ATTIC_LOCAL_STORAGE_PATH=/data/uploads
```

In Docker, mount a volume to persist uploads across container restarts:

```yaml
services:
  attic:
    volumes:
      - attic_uploads:/data/uploads
    environment:
      - ATTIC_LOCAL_STORAGE_PATH=/data/uploads

volumes:
  attic_uploads:
```

### File Permissions

When running in Docker, uploaded files are created by the container user. To match your host user's permissions, set the `ATTIC_PUID` and `ATTIC_PGID` variables:

```shell
# Find your host user/group IDs
id -u  # e.g., 1000
id -g  # e.g., 1000
```

```yaml
environment:
  - ATTIC_PUID=1000
  - ATTIC_PGID=1000
```

### Bind Mounts

You can also use a bind mount instead of a Docker volume to store files in a specific directory on the host:

```yaml
services:
  attic:
    volumes:
      - /path/on/host/uploads:/data/uploads
```

## S3-Compatible Storage

For production deployments, S3-compatible storage provides better scalability, redundancy, and the ability to serve files directly from the storage provider.

attic works with any S3-compatible service:

- **AWS S3**
- **MinIO** (self-hosted)
- **Backblaze B2**
- **DigitalOcean Spaces**
- **Cloudflare R2**
- **Wasabi**

### Configuration

```shell
ATTIC_S3_ENDPOINT=https://s3.amazonaws.com
ATTIC_S3_REGION=us-east-1
ATTIC_S3_BUCKET=attic-attachments
ATTIC_S3_ACCESS_KEY=your-access-key
ATTIC_S3_SECRET_KEY=your-secret-key
```

The bucket must already exist before starting attic.

### AWS S3

```shell
ATTIC_S3_ENDPOINT=https://s3.amazonaws.com
ATTIC_S3_REGION=us-east-1
ATTIC_S3_BUCKET=my-attic-bucket
ATTIC_S3_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
ATTIC_S3_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

Create an IAM user with permissions to read/write objects in the bucket. The minimum required policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-attic-bucket",
        "arn:aws:s3:::my-attic-bucket/*"
      ]
    }
  ]
}
```

### MinIO (Self-Hosted)

[MinIO](https://min.io/) is an open-source S3-compatible storage server you can self-host alongside attic.

Add MinIO to your `docker-compose.yml`:

```yaml
minio:
  image: minio/minio:latest
  command: server /data --console-address ":9001"
  environment:
    MINIO_ROOT_USER: minioadmin
    MINIO_ROOT_PASSWORD: minioadmin
  ports:
    - "9000:9000"
    - "9001:9001"
  volumes:
    - minio_data:/data
  restart: unless-stopped
```

Then configure attic to use MinIO:

```shell
ATTIC_S3_ENDPOINT=http://minio:9000
ATTIC_S3_REGION=us-east-1
ATTIC_S3_BUCKET=attic-attachments
ATTIC_S3_ACCESS_KEY=minioadmin
ATTIC_S3_SECRET_KEY=minioadmin
```

Create the bucket through the MinIO console at `http://localhost:9001` or using the MinIO client (`mc`).

### Backblaze B2

```shell
ATTIC_S3_ENDPOINT=https://s3.us-west-000.backblazeb2.com
ATTIC_S3_REGION=us-west-000
ATTIC_S3_BUCKET=your-bucket-name
ATTIC_S3_ACCESS_KEY=your-application-key-id
ATTIC_S3_SECRET_KEY=your-application-key
```

### Cloudflare R2

```shell
ATTIC_S3_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
ATTIC_S3_REGION=auto
ATTIC_S3_BUCKET=your-bucket-name
ATTIC_S3_ACCESS_KEY=your-access-key-id
ATTIC_S3_SECRET_KEY=your-secret-access-key
```

## Migrating Between Storage Backends

There is no built-in migration tool. To migrate from local storage to S3 (or vice versa):

1. Upload existing files from the local storage directory to your S3 bucket, preserving the directory structure
2. Update the environment variables to point to the new storage backend
3. Restart attic
