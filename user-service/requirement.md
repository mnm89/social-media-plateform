# User service

## Define the User Service Requirements

- **CRUD Operations**: The user service should allow for basic CRUD operations (Create, Read, Update, Delete) for user profiles.
- **Authentication and Authorization**: Only authenticated users should be able to access certain endpoints, with specific permissions for actions like updating or deleting user profiles.
- **Data Schema**: We’ll define a schema to represent profile details, such as `id`, `bio`, `address`, `phone`, and `user_id`.

## Set Up the Service Structure

- **Routes**: Define routes like  `GET /profile`,  `PUT /profile` , `DELETE /profile`.
- **Middleware**: `keycloak-connect` to enforce authentication on protected routes, `getProfile` Middleware to retrieve or create a profile
- **Database Integration**: using a database (e.g. PostgreSQL), set up the connection and model schema for storing profile data.

## Implement Security and Permissions

- Use Keycloak roles to restrict access to certain endpoints .
- Ensure each endpoint validates that the request includes a valid JWT.

## Set Up Docker for the User Service

- Define a Dockerfile and Docker Compose configuration for the user service if it’s a separate microservice.
- Connect it to the network so it can communicate with the API Gateway and Keycloak.

Yes, centralizing authentication logic within the **user service** is a sensible approach within a microservices architecture. This aligns with the **Single Responsibility Principle** and helps isolate all user-related functionality, including registration, login, and role assignments, within a single service. It also decouples your frontend app from the Keycloak Admin API, making the Next.js app responsible only for interacting with the user service.

Here’s a suggested approach for restructuring:

## Steps to Centralize Authentication Logic in the User Service

1. **Assign the Service Account to the User Service**:
   - Use the `user-service` Keycloak client you configured as a service account for the user service.

2. **Implement Auth Logic in the User Service**:
   - Move the `registerAction`, login, and role-assignment functions into the user service.
   - Ensure the user service interacts with Keycloak for user creation, authentication, and role management.
  
3. **Expose User-Related Endpoints** in the User Service:
   - **`/register`**: Creates a new user and assigns the `realm:user` role.
   - **`/login`**: Authenticates the user and retrieves tokens from Keycloak.
   - **`/update-profile`** (optional): Allows users to update their profiles.

4. **User Service Flow for Registration and Login**:
   - **Registration**: The user service handles registration logic and interacts with Keycloak to create the user and assign roles.
   - **Login**: The user service validates credentials and retrieves tokens from Keycloak, returning them to the frontend for storage or session handling.

### Advantages of This Approach

- **Encapsulation**: All user and authentication logic is encapsulated within the user service, reducing complexity in the frontend.
- **Scalability**: Future changes to the auth flow or integration with other identity providers will only impact the user service.
- **Security**: Only the user service interacts with Keycloak’s Admin API, keeping credentials secure and isolated from other services or frontend logic.

