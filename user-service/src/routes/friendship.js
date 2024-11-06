const express = require("express");
const { Friendship } = require("../models");
const keycloak = require("../config/keycloak");
const { Op } = require("sequelize");

const router = express.Router();

// Send a friend request
router.post("/request", keycloak.protect("realm:user"), async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    // Check if a friendship already exists
    const existingFriendship = await Friendship.findOne({
      where: { userId, friendId },
    });

    if (existingFriendship) {
      return res.status(400).json({ message: "Friend request already sent." });
    }

    // Create a new friend request
    const friendRequest = await Friendship.create({ userId, friendId });
    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
router.post("/accept/:id", keycloak.protect("realm:user"), async (req, res) => {
  const { id } = req.params;

  try {
    const friendRequest = await Friendship.findByPk(id);
    if (!friendRequest || friendRequest.status !== "pending") {
      return res.status(404).json({ message: "Friend request not found." });
    }

    const userId = req.kauth.grant.access_token.content.sub;
    if (friendRequest.friendId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to accept this request." });
    }

    // Update the status to accepted
    friendRequest.status = "accepted";
    await friendRequest.save();

    res.status(200).json(friendRequest);
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
router.post("/block/:id", keycloak.protect("realm:user"), async (req, res) => {
  const { id } = req.params;

  try {
    const friendship = await Friendship.findByPk(id);
    if (!friendship) {
      return res.status(404).json({ message: "Friendship not found." });
    }

    const userId = req.kauth.grant.access_token.content.sub;
    if (friendship.friendId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to block this user." });
    }

    friendship.status = "blocked";
    await friendship.save();

    res.status(200).json(friendship);
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Check if two users are friends
router.get("/check", keycloak.protect("realm:service"), async (req, res) => {
  const { userId, friendId } = req.query;

  try {
    const friendship = await Friendship.findOne({
      where: {
        [Op.or]: [
          {
            userId,
            friendId,
            status: "accepted",
          },
          {
            userId: friendId,
            friendId: userId,
            status: "accepted",
          },
        ],
      },
    });

    res.json({ isFriend: !!friendship });
  } catch (error) {
    console.error("Error checking friendship:", error);
    res.status(500).json({ error: "Failed to check friendship status" });
  }
});

module.exports = router;
