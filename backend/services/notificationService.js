const Notification = require("../models/Notification");
const Post = require("../models/Post");
const User = require("../models/User");
const Message = require("../models/Message");

// ======================================
// CREATE LIKE NOTIFICATION
// ======================================
const createLikeNotification = async ({
  post,
  sender
}) => {
  if (!post) {
    return null;
  }

  const recipient =
    post.author?._id || post.author;

  if (!recipient) {
    return null;
  }

  if (
    recipient.toString() ===
    sender.toString()
  ) {
    return null;
  }

  return await Notification.create({
    recipient,
    sender,
    type: "like",
    text: "liked your post",
    post: post._id
  });
};


// ======================================
// CREATE COMMENT NOTIFICATION
// ======================================
const createCommentNotification = async ({
  post,
  sender,
  comment
}) => {
  if (!post || !comment) {
    return null;
  }

  const recipient =
    post.author?._id || post.author;

  if (!recipient) {
    return null;
  }

  if (
    recipient.toString() ===
    sender.toString()
  ) {
    return null;
  }

  return await Notification.create({
    recipient,
    sender,
    type: "comment",
    text: "commented on your post",
    post: post._id,
    comment: comment._id
  });
};


// ======================================
// CREATE FOLLOW NOTIFICATION
// ======================================
const createFollowNotification = async ({
  recipient,
  sender
}) => {
  if (!recipient || !sender) {
    return null;
  }

  if (
    recipient.toString() ===
    sender.toString()
  ) {
    return null;
  }

  return await Notification.create({
    recipient,
    sender,
    type: "follow",
    text: "started following you"
  });
};


// ======================================
// CREATE MESSAGE NOTIFICATION
// ======================================
const createMessageNotification = async ({
  receiver,
  sender,
  message
}) => {
  if (!receiver || !sender || !message) {
    return null;
  }

  const senderUser =
    await User.findById(sender).select(
      "name username"
    );

  const senderName =
    senderUser?.name ||
    senderUser?.username ||
    "Someone";

  return await Notification.create({
    recipient: receiver,
    sender,
    type: "message",
    text: `sent you a message`,
    message: message._id
  });
};


// ======================================
// GET NOTIFICATIONS
// ======================================
const getNotifications = async (
  userId
) => {
  return await Notification.find({
    recipient: userId
  })
    .populate(
      "sender",
      "name username profilePicture"
    )
    .populate(
      "post",
      "content image video"
    )
    .populate(
      "comment",
      "content"
    )
    .populate(
      "message",
      "content file fileType"
    )
    .sort({
      createdAt: -1
    });
};


// ======================================
// GET UNREAD COUNT
// ======================================
const getUnreadCount = async (
  userId
) => {
  return await Notification.countDocuments({
    recipient: userId,
    isRead: false
  });
};


// ======================================
// MARK ONE NOTIFICATION AS READ
// ======================================
const markNotificationAsRead = async (
  notificationId,
  userId
) => {
  const notification =
    await Notification.findOne({
      _id: notificationId,
      recipient: userId
    });

  if (!notification) {
    const error = new Error(
      "Notification not found"
    );

    error.statusCode = 404;

    throw error;
  }

  notification.isRead = true;

  await notification.save();

  return notification;
};


// ======================================
// MARK ALL NOTIFICATIONS AS READ
// ======================================
const markAllNotificationsAsRead = async (
  userId
) => {
  await Notification.updateMany(
    {
      recipient: userId,
      isRead: false
    },
    {
      $set: {
        isRead: true
      }
    }
  );

  return true;
};


// ======================================
// DELETE NOTIFICATION
// ======================================
const deleteNotification = async (
  notificationId,
  userId
) => {
  const notification =
    await Notification.findOne({
      _id: notificationId,
      recipient: userId
    });

  if (!notification) {
    const error = new Error(
      "Notification not found"
    );

    error.statusCode = 404;

    throw error;
  }

  await Notification.findByIdAndDelete(
    notificationId
  );

  return true;
};


module.exports = {
  createLikeNotification,
  createCommentNotification,
  createFollowNotification,
  createMessageNotification,
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
};