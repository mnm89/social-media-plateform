import express from 'express';
import { keycloak } from '../config';
import Friendship from '../models/friendship';
import { isFriends, isFriendshipRequested } from '../utils';
import { Op } from 'sequelize';
import { extractUserSub } from '@social-media-platform/keycloak-utils';

const router = express.Router();

router.get('/', keycloak.protect('realm:user'), async (req, res) => {
  const userId = extractUserSub(req);
  try {
    const friendships = await Friendship.findAll({
      where: { [Op.or]: [{ userId }, { friendId: userId }] },
      order: [['createdAt', 'ASC']],
    });
    res.json(friendships);
  } catch (error) {
    console.error('Error getting user friendships :', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Send a friend request
router.post('/request', keycloak.protect('realm:user'), async (req, res) => {
  const { friendId } = req.body;
  const userId = extractUserSub(req);

  try {
    // Check if a friendship already exists
    const isFriendshipExists = await isFriendshipRequested(userId, friendId);
    if (isFriendshipExists) {
      return res.status(400).json({ message: 'Friend request already sent.' });
    }

    // Create a new friend request
    const friendRequest = await Friendship.create({ userId, friendId });
    res.status(201).json(friendRequest);
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/accept/:id', keycloak.protect('realm:user'), async (req, res) => {
  const { id } = req.params;

  try {
    const friendRequest = await Friendship.findByPk(id);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found.' });
    }

    const userId = extractUserSub(req);
    if (friendRequest.friendId !== userId) {
      return res.status(403).json({
        message: 'Not authorized to accept this friendship request.',
      });
    }

    // Update the status to accepted
    friendRequest.status = 'accepted';
    await friendRequest.save();

    res.status(200).json(friendRequest);
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/block/:id', keycloak.protect('realm:user'), async (req, res) => {
  const { id } = req.params;

  try {
    const friendship = await Friendship.findByPk(id);
    if (!friendship) {
      return res.status(404).json({ message: 'Friendship not found.' });
    }

    const userId = extractUserSub(req);
    if (friendship.friendId !== userId) {
      return res.status(403).json({
        message: 'Not authorized to block this friendship request.',
      });
    }

    friendship.status = 'blocked';
    await friendship.save();

    res.status(200).json(friendship);
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.delete('/:id', keycloak.protect('realm:user'), async (req, res) => {
  const { id } = req.params;

  try {
    const friendship = await Friendship.findByPk(id);
    if (!friendship) {
      return res.status(404).json({ message: 'Friendship not found.' });
    }

    const userId = extractUserSub(req);
    if (friendship.userId !== userId) {
      return res.status(403).json({
        message: 'Not authorized to delete this friendship request.',
      });
    }

    await friendship.destroy();

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting friendship:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Check if two users are friends
router.get('/check', keycloak.protect('realm:service'), async (req, res) => {
  const { userId, friendId } = req.query;

  try {
    const isFriend = await isFriends(userId, friendId);

    res.json({ isFriend });
  } catch (error) {
    console.error('Error checking friendship:', error);
    res.status(500).json({ message: 'Failed to check friendship status' });
  }
});

export default router;
