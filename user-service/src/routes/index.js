const express = require("express");
const authRoutes = require("./auth");
const userRoutes = require("./user");
const friendshipRoutes = require("./friendship");

const router = express.Router();
// Mount the routes

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/friendships", friendshipRoutes);

module.exports = router;
