// middleware/authenticate.js
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

// Configure JWKS client with the Keycloak JWKS URI
const client = jwksClient({
  jwksUri: `${process.env.KEYCLOAK_SERVER_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

async function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (!token) {
      next(); // Proceed without authentication if no token is provided
    } else {
      jwt.verify(
        token,
        getKey,
        { algorithms: ["RS256"] },
        (err, decodedToken) => {
          if (!err) {
            req.user = decodedToken; // Attach the decoded token to the request
          } else {
            console.error("Token verification failed:", err);
          }
          next();
        }
      );
    }
  } else {
    next(); // Proceed without authentication if no token is provided
  }
}

module.exports = authenticate;
