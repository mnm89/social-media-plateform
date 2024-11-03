const session = require("express-session");

// Configure session for Keycloak
const memoryStore = new session.MemoryStore();
module.exports = {
  store: memoryStore,
  middleware: () =>
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: memoryStore,
    }),
};
