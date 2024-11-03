const express = require("express");

const app = express();
const memoryStore = new session.MemoryStore();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

const keycloak = new Keycloak(
  { store: memoryStore },
  {
    realm: process.env.KEYCLOAK_REALM,
    "auth-server-url": process.env.KEYCLOAK_SERVER_URL,
    resource: process.env.KEYCLOAK_CLIENT_ID,
    "bearer-only": true,
    "ssl-required": "external",
    "confidential-port": 0,
  }
);
app.use(keycloak.middleware());
app.use(express.json());
app.use("/posts", postRoutes);

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Post service running on port ${PORT}`);
});
