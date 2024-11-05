require("dotenv").config();
const express = require("express");
const session = require("./config/session");
const keycloak = require("./config/keycloak");
const postRoutes = require("./routes/posts");
const publicRoutes = require("./routes/public");

const app = express();

app.use(session.middleware());
app.use(keycloak.middleware());
app.use(express.json());

app.use("/posts", postRoutes);
app.use("/public", publicRoutes);

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Post service running on port ${PORT}`);
});
