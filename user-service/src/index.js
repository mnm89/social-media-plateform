require("dotenv").config();
const express = require("express");
const session = require("./config/session");
const keycloak = require("./config/keycloak");
const routes = require("./routes");
const { bootstrapUsersProfile } = require("./config/profile");

const app = express();

app.use(session.middleware());
app.use(keycloak.middleware());
app.use(express.json());

app.use("/", routes);

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  bootstrapUsersProfile();
  console.log(`User service running on port ${PORT}`);
});
