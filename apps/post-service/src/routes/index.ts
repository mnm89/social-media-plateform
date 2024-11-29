import { Router } from 'express';
import { keycloak } from '../config';
import publicRoutes from './public';
import postRoutes from './post';
import commentRoutes from './comment';
import likeRoutes from './like';

const router = Router();
router.use('/posts', keycloak.protect('realm:user'), postRoutes);
router.use('/comments', keycloak.protect('realm:user'), commentRoutes);
router.use('/likes', keycloak.protect('realm:user'), likeRoutes);
router.use('/public', publicRoutes);
export default router;
