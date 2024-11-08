
# Project Roadmap

## **Project Structure and Architecture**

- **Services**:
  - **User Service**: Handles user authentication, profile management, and connections.
  - **Post Service**: Manages creating, updating, and deleting posts, with support for media uploads.
  - **Notification Service**: Pushes real-time notifications for likes, comments, follows, etc.
  - **Recommendation Service**: Suggests posts and users based on engagement patterns and preferences.
- **Common Components**:
  - **API Gateway**: Manages routing and authentication across microservices.
  - **Event Streaming**: Uses RabbitMQ or Kafka to handle asynchronous events like notifications and recommendations.
  - **Postgres**: for relational data (user profiles, posts).
  - **Redis**: for caching and real-time data.
  - **Keycloak**: manages authentication across all services, avoiding duplicate auth logic in each microservice.
  - **Load Balancer**: For efficient distribution across microservices.

## **Development Phases**

- **Phase 1**: Set up the core microservices (User and Post) with basic CRUD operations.
- **Phase 2**: Integrate the API Gateway and handle user authentication with keycloak.
- **Phase 3**: Implement real-time notifications with the Notification Service and message broker.
- **Phase 4**: Develop the Recommendation Service and fine-tune the platform for performance.

## **Tech Stack**

- **Backend**: Node.js
- **Frontend**: Next.js
- **Data**: Postgres, Redis
- **Event Broker**: RabbitMQ
- **Authentication**: Keycloak
- **Containerization**: Docker Compose
