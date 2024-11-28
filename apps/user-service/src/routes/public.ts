import express from 'express';
import {
  authenticate,
  AuthenticatedRequest,
  getKeycloakUser,
} from '@social-media-platform/keycloak-utils';
import { buildUserProfileWithPrivacy } from '../utils';

const router = express.Router();

router.get(
  '/profiles/:id',
  authenticate,
  async (req: AuthenticatedRequest, res) => {
    const user = await getKeycloakUser(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Failed to find user' });
    }

    const { profile } = await buildUserProfileWithPrivacy(user, req.user?.sub);

    res.json(profile);
  }
);

router.get('/profiles', authenticate, async (req, res) => {
  res.json({ message: 'not implemented' });
});

export default router;
