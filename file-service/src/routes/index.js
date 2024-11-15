const express = require("express");
const mediaRoutes = require("./media");

const router = express.Router();
router.use("/medias", mediaRoutes);

module.exports = router;
