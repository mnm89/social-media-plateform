const express = require("express");
const keycloak = require("../config/keycloak");
const postRoutes = require("./posts");
const commentRoutes = require("./comments");
const likeRoutes = require("./likes");
const publicRoutes = require("./public");

const router = express.Router();
// Mount the routes
router.use("/posts", keycloak.protect("realm:user"), postRoutes);
router.use("/comments", keycloak.protect("realm:user"), commentRoutes);
router.use("/likes", keycloak.protect("realm:user"), likeRoutes);
router.use("/public", publicRoutes);

module.exports = router;
