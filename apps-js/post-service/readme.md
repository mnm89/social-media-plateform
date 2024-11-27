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

4. **Backend Visibility Logic**:
   - **Public**: Accessible by everyone, including visitors.
   - **Private**: Accessible by all logged-in/registered users.
   - **Friends-Only**: Accessible only by friends of the post author.

## Suggested API Endpoint Logic

- **Homepage (`GET /public`)**:
  - Retrieve all public posts for visitors.
- **Homepage (`GET /posts`)**:
  - For logged-in users, retrieve both public and private posts.
  - Filter for friends-only posts based on the relationship between the post author and the user.

- **Post Actions (Like, Comment)**:
  - Allow actions only if the user meets the visibility requirements:
    - Public posts: Actions enabled for all logged-in users.
    - Private posts: Actions enabled for all logged-in users.
    - Friends-only posts: Actions enabled if the user is friends with the post author.

### Models

1. **Comment**:
   - `id`: Unique identifier for the comment
   - `postId`: ID of the post to which the comment belongs
   - `userId`: ID of the user who made the comment
   - `content`: Text content of the comment
   - `parentId`: ID of the parent comment, if it’s a reply (otherwise null)
   - `createdAt` and `updatedAt`: Timestamps for comment creation and update

2. **Like**:
   - `id`: Unique identifier for the like
   - `postId`: ID of the post that received the like
   - `userId`: ID of the user who liked the post
   - `createdAt`: Timestamp for when the like was created

### API Endpoints

#### Comments

1. **Add Comment to Post**
   - **POST** `/posts/:postId/comments`
   - Request Body: `{ "content": "Comment text", "parentId": null }`
   - Only authenticated users can add comments.

2. **Get Comments for Post**
   - **GET** `/posts/:postId/comments`
   - Response: A list of comments with nested replies.

3. **Edit Comment**
   - **PUT** `/comments/:commentId`
   - Allows the comment’s author to update the content.

4. **Delete Comment**
   - **DELETE** `/comments/:commentId`
   - Allows the comment’s author to delete it.

#### Likes

1. **Add Like to Post**
   - **POST** `/posts/:postId/like`
   - Adds a like from the authenticated user.

2. **Remove Like from Post**
   - **DELETE** `/posts/:postId/like`
   - Removes the like from the authenticated user.

3. **Get Like Count for Post**
   - **GET** `/posts/:postId/likes`
   - Returns the count of likes for a post.
