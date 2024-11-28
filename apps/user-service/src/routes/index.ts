import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import publicRoutes from './public';
import friendshipRoutes from './friendship';
import profileRoutes from './profile';

const router = Router();
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/friendships', friendshipRoutes);
router.use('/profiles', profileRoutes);
router.use('/public', publicRoutes);
export default router;
