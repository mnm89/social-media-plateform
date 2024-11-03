# Post service

## Outline for Post-Service Implementation

1. **Define Requirements for the Post-Service**:
   - **CRUD Operations**: Basic functionality for creating, reading, updating, and deleting posts.
   - **Associations**: Each post should be linked to a user, so we’ll need a way to associate posts with their creators.
   - **Additional Fields**: Include fields like `content`, `title`, `createdAt`, `updatedAt`, and potentially `visibility` (public, private, friends-only).
   - **Likes and Comments**: We can plan for interactions like likes and comments, even if we don’t implement them right away.

2. **Database Schema**:
   - Define the schema for a `Post` table, including associations with the `User` table (using the Keycloak user ID for the relationship).
   - Set up migrations for creating and updating the schema.

3. **Routes and Middleware**:
   - **Protected Routes**: Use `keycloak-connect` to restrict post creation, updating, and deletion to authenticated users.
   - **Public and Private Access**: Implement logic to handle post visibility based on the `visibility` field.
