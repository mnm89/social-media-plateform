const express = require("express");
const authRoutes = require("./auth");
const userRoutes = require("./user");
const friendshipRoutes = require("./friendship");
const profileRoutes = require("./profile");

const router = express.Router();
// Mount the routes

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/friendships", friendshipRoutes);
router.use("/profiles", profileRoutes);

module.exports = router;
