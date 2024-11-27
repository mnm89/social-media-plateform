const express = require("express");
const mediaRoutes = require("./media");
const avatarRoutes = require("./avatar");
const publicRoutes = require("./public");

const router = express.Router();

router.use("/medias", mediaRoutes);
router.use("/avatars", avatarRoutes);
router.use("/public", publicRoutes);

module.exports = router;
