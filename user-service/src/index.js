const express = require("express");
const profileRoutes = require("./routes/profile");
const authRoutes = require("./routes/auth");
const session = require("./config/session");
const keycloak = require("./config/keycloak");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

app.use(session.middleware());
app.use(keycloak.middleware());
app.use(express.json());

// Use the profile routes
app.use("/profile", profileRoutes);
// Use the auth routes
app.use("/auth", authRoutes);

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
