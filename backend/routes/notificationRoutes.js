const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getAll,
  unreadCount,
  markAsRead,
  markAllAsRead,
  remove
} = require("../controllers/notificationController");

// Get all notifications
router.get(
  "/",
  protect,
  getAll
);

// Get unread notification count
router.get(
  "/unread",
  protect,
  unreadCount
);

// Mark one notification as read
router.patch(
  "/:notificationId/read",
  protect,
  markAsRead
);

// Mark all notifications as read
router.patch(
  "/read-all",
  protect,
  markAllAsRead
);

// Delete notification
router.delete(
  "/:notificationId",
  protect,
  remove
);

module.exports = router;