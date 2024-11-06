const express = require("express");
const { Like } = require("../models");

const router = express.Router();

router.post("/:postId", keycloak.protect(), async (req, res) => {
  const { postId } = req.params;
  const userId = req.kauth.grant.access_token.content.sub;

  try {
    const [like, created] = await Like.findOrCreate({
      where: { postId, userId },
    });

    if (!created) {
      return res.status(409).json({ message: "Already liked this post" });
    }
    res.status(201).json(like);
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Failed to like post" });
  }
});

router.delete("/:postId", keycloak.protect(), async (req, res) => {
  const { postId } = req.params;
  const userId = req.kauth.grant.access_token.content.sub;

  try {
    const like = await Like.findOne({ where: { postId, userId } });

    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }

    await like.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ error: "Failed to unlike post" });
  }
});
module.exports = router;
