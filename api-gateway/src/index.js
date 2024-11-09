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

// Open auth routes
["/register", "/login", "/refresh"].forEach((path) => {
  app.post(
    path,
    createProxyMiddleware({
      target: `${process.env.USER_SERVICE_URL}`,
      changeOrigin: true,
      pathRewrite: { [`^${path}`]: `/auth${path}` },
      on: {
        error: (err, req, res) => {
          console.error("Proxy Error: ", err);
          res.status(500).json({ message: "Internal server error" });
        },
      },
    })
  );
});

// Open profiles route
app.get(
  "/public-profiles/:id",
  createProxyMiddleware({
    target: `${process.env.USER_SERVICE_URL}`,
    changeOrigin: true,
    pathRewrite: (path) => {
      return path.replace("public-profiles", "profiles");
    },
    on: {
      error: (err, req, res) => {
        console.error("Proxy Error: ", err);
        res.status(500).json({ message: "Internal server error" });
      },
    },
  })
);

// Open posts endpoint
app.get(
  "/public-posts",
  createProxyMiddleware({
    target: `${process.env.POST_SERVICE_URL}`,
    changeOrigin: true,
    pathRewrite: (path) => {
      return path.replace("public-posts", "public");
    },
    on: {
      error: (err, req, res) => {
        console.error("Proxy Error: ", err);
        res.status(500).json({ message: "Internal server error" });
      },
    },
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
      changeOrigin: true,
      on: {
        error: (err, req, res) => {
          console.error("Proxy Error: ", err);
          res.status(500).json({ message: "Internal server error" });
        },
      },
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
      changeOrigin: true,
      on: {
        error: (err, req, res) => {
          console.error("Proxy Error: ", err);
          res.status(500).json({ message: "Internal server error" });
        },
      },
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
