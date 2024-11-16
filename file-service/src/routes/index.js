const express = require("express");
const mediaRoutes = require("./media");
const avatarRoutes = require("./avatar");

const router = express.Router();

router.use("/medias", mediaRoutes);
router.use("/avatars", avatarRoutes);

module.exports = router;
