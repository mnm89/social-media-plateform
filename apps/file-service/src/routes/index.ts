import { Router } from 'express';
import mediaRoutes from './media';
import publicRoutes from './public';
import avatarRoutes from './avatar';

const router = Router();
router.use('/medias', mediaRoutes);
router.use('/avatars', avatarRoutes);
router.use('/public', publicRoutes);
export default router;
