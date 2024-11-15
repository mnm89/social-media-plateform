# File Service

A microservice designed to manage media files (images, videos, sounds, etc.) for the platform. It integrates with MinIO for object storage and provides endpoints for uploading, retrieving, and managing files.

## Requirements

### Functional Requirements

- Store and retrieve media files linked to specific entities (`user_id`, `post_id`, etc.).
- Support categorization of files by type (e.g., avatar, video, sound, image).
- Provide CRUD operations for media metadata.
- Handle file uploads and validations (e.g., size, format).
- Integrate with MinIO for scalable and secure object storage.
- Generate pre-signed URLs for secure direct file access.

### Non-Functional Requirements

- Ensure high availability and fault tolerance.
- Implement proper authentication and authorization for file access.
- Scalable to handle large file uploads and downloads.
- Secure file storage and transmission.

## Features

1. **File Upload**
   - Upload files with metadata such as `external_id`, `entity_type`, and `type`.
   - Validate file types and sizes during upload.

2. **File Metadata Management**
   - Store and retrieve file metadata:
     - `id`: Unique identifier for the file.
     - `external_id`: ID of the associated entity (e.g., user, post).
     - `entity_type`: Type of the associated entity (e.g., `user`, `post`).
     - `type`: File category (e.g., avatar, image, video, sound).
     - `url`: Public or pre-signed URL for file access.
     - `created_at`: Timestamp of file upload.
     - `updated_at`: Timestamp of last update.

3. **Retrieve Files**
   - Get metadata or URLs for specific files by `external_id` and `entity_type`.
   - Support fetching all files linked to an `external_id` and a specific entity type.

4. **MinIO Integration**
   - Store all media files in a MinIO bucket.
   - Generate pre-signed URLs for direct file uploads and downloads.

5. **File Deletion**
   - Delete files by ID or `external_id` and type.
   - Remove associated metadata and object storage files.

6. **Authentication and Authorization**
   - Require valid service tokens or user authentication for accessing the service.
   - Restrict file access based on user permissions.

## API Endpoints

### File Upload

`POST /files/upload`

- **Request**:

  ```json
  {
    "external_id": "12345",
    "entity_type": "post",
    "type": "image",
    "file": "<binary>"
  }
  ```

- **Response**:

  ```json
  {
    "id": "abc123",
    "url": "https://minio.example.com/bucket/image-abc123.jpg",
    "external_id": "12345",
    "entity_type": "post",
    "type": "image",
    "created_at": "2024-11-15T12:00:00Z",
    "updated_at": "2024-11-15T12:00:00Z"
  }
  ```

### Get File Metadata

`GET /files/:id`

- **Request**: File ID
- **Response**:

  ```json
  {
    "id": "abc123",
    "url": "https://minio.example.com/bucket/image-abc123.jpg",
    "external_id": "12345",
    "entity_type": "post",
    "type": "image",
    "created_at": "2024-11-15T12:00:00Z",
    "updated_at": "2024-11-15T12:00:00Z"
  }
  ```

### Get Files by External ID and Entity Type

`GET /files`

- **Request**: Query params (`external_id`, `entity_type`, `type`)
- **Response**:

  ```json
  [
    {
      "id": "abc123",
      "url": "https://minio.example.com/bucket/image-abc123.jpg",
      "external_id": "12345",
      "entity_type": "post",
      "type": "image",
      "created_at": "2024-11-15T12:00:00Z",
      "updated_at": "2024-11-15T12:00:00Z"
    }
  ]
  ```

### Delete File

`DELETE /files/:id`

- **Request**: File ID
- **Response**:

  ```json
  {
    "success": true,
    "message": "File deleted successfully."
  }
  ```

### Generate Pre-Signed URL

`POST /files/presigned-url`

- **Request**:

  ```json
  {
    "external_id": "12345",
    "entity_type": "post",
    "type": "image",
    "file_name": "example.jpg"
  }
  ```

- **Response**:

  ```json
  {
    "presigned_url": "https://minio.example.com/bucket/example.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256..."
  }
  ```

## Getting Started

### Prerequisites

- Node.js (v16+)
- MinIO server
- PostgreSQL or MongoDB for metadata storage

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd file-service
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:

   ```env
   MINIO_ENDPOINT=<minio-endpoint>
   MINIO_ACCESS_KEY=<access-key>
   MINIO_SECRET_KEY=<secret-key>
   MINIO_BUCKET_NAME=<bucket-name>
   DATABASE_URL=<database-connection-string>
   JWT_SECRET=<jwt-secret>
   ```

4. Start the service:

   ```bash
   npm run start
   ```

## Architecture

### Storage Model

| Field         | Type        | Description                                 |
|---------------|-------------|---------------------------------------------|
| `id`          | UUID        | Unique identifier for the file.            |
| `external_id` | UUID        | ID of the associated entity.               |
| `entity_type` | String      | Type of the associated entity (e.g., `user`, `post`). |
| `type`        | String      | File type (e.g., avatar, video).           |
| `url`         | String      | URL for accessing the file.                |
| `created_at`  | Timestamp   | Timestamp of file upload.                  |
| `updated_at`  | Timestamp   | Timestamp of last metadata update.         |

### Integration with MinIO

- Files are stored in MinIO with a hierarchical structure:
  - Example: `bucket-name/entity-type/<file-id>.jpg`

## Future Enhancements

- Add support for video streaming (e.g., HLS).
- Implement file versioning.
- Add support for multipart uploads for large files.
- Integrate with a CDN for faster file delivery.
