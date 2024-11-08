const express = require("express");
const keycloak = require("../config/keycloak");
const authRoutes = require("./auth");
const userRoutes = require("./user");
const friendshipRoutes = require("./friendship");

const router = express.Router();
// Mount the routes

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/friendship", friendshipRoutes);

module.exports = router;
