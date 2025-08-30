import express from 'express';
import { getNotifications, getUnreadNotifications, markAsRead, createNotification } from '../controllers/notification.controller.js';
import verifyUser from '../middlewares/verifyUser.js';

const router = express.Router();

router.get('/', verifyUser, getNotifications);
router.get('/unread', verifyUser, getUnreadNotifications);
router.patch('/:id/read', verifyUser, markAsRead);
router.post('/', createNotification); // For admin/testing

export default router;
