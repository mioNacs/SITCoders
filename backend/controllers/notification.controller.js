import Notification from '../models/notification.model.js';

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

export const getUnreadNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id, isRead: false }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch unread notifications' });
    }
};

export const markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to mark as read' });
    }
};

export const createNotification = async (req, res) => {
    try {
        const notification = new Notification({
            user: req.body.user,
            message: req.body.message
        });
        await notification.save();
        // Emit real-time notification
        if (req.app.get('io')) {
            req.app.get('io').to(req.body.user).emit('notification', notification);
        }
        res.status(201).json(notification);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create notification' });
    }
};
