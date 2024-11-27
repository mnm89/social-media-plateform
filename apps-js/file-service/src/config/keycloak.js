const Keycloak = require("keycloak-connect");
const session = require("./session");
// Keycloak configuration
module.exports = new Keycloak(
  { store: session.store },
  {
    realm: process.env.KEYCLOAK_REALM,
    "auth-server-url": process.env.KEYCLOAK_SERVER_URL,
    "ssl-required": "external",
    resource: process.env.KEYCLOAK_CLIENT_ID,
    "confidential-port": 0,
    "bearer-only": true,
  }
);
