const {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} = require("../services/notificationService");

const {
  sendSuccess
} = require("../utils/response");

// ======================================
// GET ALL NOTIFICATIONS
// GET /api/notifications
// ======================================
const getAll = async (req, res, next) => {
  try {
    const notifications =
      await getNotifications(
        req.user._id
      );

    return sendSuccess(
      res,
      200,
      "Notifications fetched successfully",
      { notifications }
    );
  } catch (error) {
    next(error);
  }
};

// ======================================
// GET UNREAD COUNT
// GET /api/notifications/unread
// ======================================
const unreadCount = async (
  req,
  res,
  next
) => {
  try {
    const count =
      await getUnreadCount(
        req.user._id
      );

    return sendSuccess(
      res,
      200,
      "Unread notification count fetched successfully",
      { count }
    );
  } catch (error) {
    next(error);
  }
};

// ======================================
// MARK ONE AS READ
// PATCH /api/notifications/:notificationId/read
// ======================================
const markAsRead = async (
  req,
  res,
  next
) => {
  try {
    const notification =
      await markNotificationAsRead(
        req.params.notificationId,
        req.user._id
      );

    return sendSuccess(
      res,
      200,
      "Notification marked as read",
      { notification }
    );
  } catch (error) {
    next(error);
  }
};

// ======================================
// MARK ALL AS READ
// PATCH /api/notifications/read-all
// ======================================
const markAllAsRead = async (
  req,
  res,
  next
) => {
  try {
    await markAllNotificationsAsRead(
      req.user._id
    );

    return sendSuccess(
      res,
      200,
      "All notifications marked as read"
    );
  } catch (error) {
    next(error);
  }
};

// ======================================
// DELETE NOTIFICATION
// DELETE /api/notifications/:notificationId
// ======================================
const remove = async (
  req,
  res,
  next
) => {
  try {
    await deleteNotification(
      req.params.notificationId,
      req.user._id
    );

    return sendSuccess(
      res,
      200,
      "Notification deleted successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  unreadCount,
  markAsRead,
  markAllAsRead,
  remove
};