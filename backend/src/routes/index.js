import { Router } from 'express';
import authRoutes       from './authRoutes.js';
import dashboardRoutes  from './dashboardRoutes.js';
import foodRoutes       from './foodRoutes.js';
import nutritionRoutes  from './nutritionRoutes.js';
import clusteringRoutes from './clusteringRoutes.js';
import menuRoutes       from './menuRoutes.js';
import feedbackRoutes   from './feedbackRoutes.js';

const router = Router();

router.use('/auth',       authRoutes);
router.use('/dashboard',  dashboardRoutes);
router.use('/foods',      foodRoutes);
router.use('/nutritions', nutritionRoutes);
router.use('/clustering', clusteringRoutes);
router.use('/menus',      menuRoutes);
router.use('/feedback',   feedbackRoutes);

export default router;
