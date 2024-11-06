require("dotenv").config();
const express = require("express");
const session = require("./config/session");
const keycloak = require("./config/keycloak");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const userRoutes = require("./routes/user");
const friendshipRoutes = require("./routes/friendship");
const { bootstrapUsersProfile } = require("./config/profile");

const app = express();

app.use(session.middleware());
app.use(keycloak.middleware());
app.use(express.json());

// Use the auth routes
app.use("/auth", authRoutes);
// Use the profile routes
app.use("/profiles", profileRoutes);
// Use the friends routes
app.use("/users", userRoutes);
// Use the friends routes
app.use("/friendships", friendshipRoutes);

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  bootstrapUsersProfile();
  console.log(`User service running on port ${PORT}`);
});
