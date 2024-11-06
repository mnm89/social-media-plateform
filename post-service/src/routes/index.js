const express = require("express");
const router = express.Router();
const postRoutes = require("./posts");
const commentRoutes = require("./comments");
const likeRoutes = require("./likes");
const publicRoutes = require("./public");

// Mount the routes
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/likes", likeRoutes);
router.use("/public", publicRoutes);

module.exports = router;
