const express = require("express");
const session = require("express-session");
const { createProxyMiddleware } = require("http-proxy-middleware");
const Keycloak = require("keycloak-connect");
const dotenv = require("dotenv");
const proxyConfig = require("./proxy");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure session for Keycloak
const memoryStore = new session.MemoryStore();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

// Keycloak configuration
const keycloak = new Keycloak(
  { store: memoryStore },
  {
    realm: process.env.KEYCLOAK_REALM,
    "auth-server-url": process.env.KEYCLOAK_SERVER_URL,
    "ssl-required": "external",
    resource: process.env.KEYCLOAK_CLIENT_ID,
    "confidential-port": 0,
    "bearer-only": true,
  }
);

// Protect routes using Keycloak
app.use(keycloak.middleware());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Open auth routes
["/register", "/login", "/refresh"].forEach((path) => {
  app.post(
    path,
    createProxyMiddleware({
      target: `${process.env.USER_SERVICE_URL}`,
      pathRewrite: { [`^${path}`]: `/auth${path}` },
      ...proxyConfig,
    })
  );
});

// Open profiles route
app.use(
  "/public-profiles",
  createProxyMiddleware({
    target: `${process.env.USER_SERVICE_URL}/public/profiles`,
    ...proxyConfig,
  })
);

// Open posts endpoint
app.use(
  "/public-posts",
  createProxyMiddleware({
    target: `${process.env.POST_SERVICE_URL}/public/posts`,
    ...proxyConfig,
  })
);

// Open routes for File Service
app.use(
  "/public-files",
  createProxyMiddleware({
    target: `${process.env.FILE_SERVICE_URL}/public/files`, // URL of the post service
    ...proxyConfig,
  })
);

// Protected routes for User Service
["/users", "/friendships", "/profiles"].forEach((path) => {
  app.use(
    path,
    keycloak.protect((token) => {
      return token.hasRole("realm:user") || token.hasRole("realm:admin");
    }),
    createProxyMiddleware({
      target: `${process.env.USER_SERVICE_URL}${path}`, // URL of the post service
      ...proxyConfig,
    })
  );
});

// Protected routes for Post Service
["/posts", "/comments", "/likes"].forEach((path) => {
  app.use(
    path,
    keycloak.protect((token) => {
      return token.hasRole("realm:user") || token.hasRole("realm:admin");
    }),
    createProxyMiddleware({
      target: `${process.env.POST_SERVICE_URL}${path}`, // URL of the post service
      ...proxyConfig,
    })
  );
});

// Protected routes for File Service
["/avatars", "/medias"].forEach((path) => {
  app.use(
    path,
    keycloak.protect((token) => {
      return token.hasRole("realm:user") || token.hasRole("realm:admin");
    }),
    createProxyMiddleware({
      target: `${process.env.FILE_SERVICE_URL}${path}`, // URL of the post service
      ...proxyConfig,
    })
  );
});

// Fallback route to catch access-denied errors
app.use((err, req, res, next) => {
  console.error("Error in request:", err);
  res.status(err.status || 500).send(err.message || "Internal server error");
});

// Start the API Gateway server
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
