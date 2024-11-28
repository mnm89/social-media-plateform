import { getKeycloakUser } from '@social-media-platform/keycloak-utils';
import { getUserAvatarUrl } from '../utils';
import express from 'express';
import { keycloak } from '../config';

const router = express.Router();
router.use(keycloak.protect('realm:service'));

// Route to get another user's attributes (not managed by the privacy model)
// used by other services mostly
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await getKeycloakUser(id);
  if (!user) {
    return res.status(500).json({ message: 'Failed to find user' });
  }

  const { username, email } = user;

  const avatar = await getUserAvatarUrl(id);

  const response = {
    id,
    username,
    email,
    avatar,
  };

  res.json(response);
});
export default router;
