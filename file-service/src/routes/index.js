const express = require("express");
const mediaRoutes = require("./media");
const avatarRoutes = require("./avatar");
const filesRoutes = require("./file");

const router = express.Router();

router.use("/medias", mediaRoutes);
router.use("/avatars", avatarRoutes);
router.use("/files", filesRoutes);

module.exports = router;
