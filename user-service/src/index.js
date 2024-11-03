const express = require("express");
const profileRoutes = require("./routes/profile");

// Load environment variables
dotenv.config();

const app = express();
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

app.use(keycloak.middleware());
app.use(express.json());

// Use the profile routes
app.use("/profile", profileRoutes);

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
