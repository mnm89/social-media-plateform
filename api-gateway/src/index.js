const express = require("express");
const session = require("express-session");
const { createProxyMiddleware } = require("http-proxy-middleware");
const Keycloak = require("keycloak-connect");
const dotenv = require("dotenv");

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

// Open /register and /login routes
app.post(
  "/register",
  createProxyMiddleware({
    target: `${process.env.USER_SERVICE_URL}`,
    changeOrigin: true,
    pathRewrite: { "^/register": "/auth/register" },
  })
);

app.post(
  "/login",
  createProxyMiddleware({
    target: `${process.env.USER_SERVICE_URL}`,
    changeOrigin: true,
    pathRewrite: { "^/login": "/auth/login" },
  })
);

// Example protected route for Post Service
app.use(
  "/users",
  keycloak.protect((token) => {
    return token.hasRole("user") || token.hasRole("admin");
  }),
  (req, res) => {
    res.send("Post service endpoint");
  }
);

// Example protected route for Post Service
app.use(
  "/posts",
  keycloak.protect((token) => {
    return token.hasRole("user") || token.hasRole("admin");
  }),
  (req, res) => {
    res.send("Post service endpoint");
  }
);

// Fallback route to catch access-denied errors
app.use((err, req, res, next) => {
  console.error("Error in request:", err);
  res.status(err.status || 500).send(err.message || "Access Denied");
});

// Start the API Gateway server
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
