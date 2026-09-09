const Message = require("../models/Message");
const User = require("../models/User");

// ==========================================
// SEND MESSAGE
// ==========================================

const sendMessage = async ({
  sender,
  receiver,
  content,
  messageType = "text",
  file = null,
  fileType = null,
}) => {
  if (!sender || !receiver) {
    const error = new Error(
      "Sender and receiver are required"
    );

    error.statusCode = 400;
    throw error;
  }

  if (sender.toString() === receiver.toString()) {
    const error = new Error(
      "You cannot send a message to yourself"
    );

    error.statusCode = 400;
    throw error;
  }

  // Check receiver exists
  const receiverUser = await User.findById(
    receiver
  );

  if (!receiverUser) {
    const error = new Error(
      "Receiver user not found"
    );

    error.statusCode = 404;
    throw error;
  }

  // Text validation
  if (
    messageType === "text" &&
    (!content || !content.trim())
  ) {
    const error = new Error(
      "Message cannot be empty"
    );

    error.statusCode = 400;
    throw error;
  }

  const message = await Message.create({
    sender,
    receiver,
    content:
      content?.trim() || "",
    messageType,
    file,
    fileType,
  });

  return await Message.findById(
    message._id
  )
    .populate(
      "sender",
      "name username profilePicture"
    )
    .populate(
      "receiver",
      "name username profilePicture"
    );
};


// ==========================================
// GET CONVERSATION
// ==========================================

const getConversation = async (
  userId,
  otherUserId
) => {
  if (!otherUserId) {
    const error = new Error(
      "Other user is required"
    );

    error.statusCode = 400;
    throw error;
  }

  const otherUser = await User.findById(
    otherUserId
  );

  if (!otherUser) {
    const error = new Error(
      "User not found"
    );

    error.statusCode = 404;
    throw error;
  }

  const messages = await Message.find({
    $or: [
      {
        sender: userId,
        receiver: otherUserId,
      },
      {
        sender: otherUserId,
        receiver: userId,
      },
    ],
  })
    .populate(
      "sender",
      "name username profilePicture"
    )
    .populate(
      "receiver",
      "name username profilePicture"
    )
    .sort({
      createdAt: 1,
    });

  return messages;
};


// ==========================================
// GET CONVERSATIONS / INBOX
// ==========================================

const getConversations = async (
  userId
) => {
  const messages = await Message.find({
    $or: [
      {
        sender: userId,
      },
      {
        receiver: userId,
      },
    ],
  })
    .populate(
      "sender",
      "name username profilePicture"
    )
    .populate(
      "receiver",
      "name username profilePicture"
    )
    .sort({
      createdAt: -1,
    });

  const conversations = [];
  const seenUsers = new Set();

  for (const message of messages) {
    const senderId =
      message.sender?._id?.toString();

    const receiverId =
      message.receiver?._id?.toString();

    const otherUserId =
      senderId === userId.toString()
        ? receiverId
        : senderId;

    if (!otherUserId) {
      continue;
    }

    if (seenUsers.has(otherUserId)) {
      continue;
    }

    seenUsers.add(otherUserId);

    const otherUser =
      senderId === userId.toString()
        ? message.receiver
        : message.sender;

    const unreadCount =
      await Message.countDocuments({
        sender: otherUserId,
        receiver: userId,
        isRead: false,
      });

    conversations.push({
      user: otherUser,
      lastMessage: message,
      unreadCount,
    });
  }

  return conversations;
};


// ==========================================
// MARK CONVERSATION AS READ
// ==========================================

const markConversationAsRead = async (
  userId,
  otherUserId
) => {
  await Message.updateMany(
    {
      sender: otherUserId,
      receiver: userId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    }
  );

  return true;
};


// ==========================================
// MARK ONE MESSAGE AS READ
// ==========================================

const markMessageAsRead = async (
  messageId,
  userId
) => {
  const message =
    await Message.findOne({
      _id: messageId,
      receiver: userId,
    });

  if (!message) {
    const error = new Error(
      "Message not found"
    );

    error.statusCode = 404;
    throw error;
  }

  message.isRead = true;
  message.readAt = new Date();

  await message.save();

  return message;
};


// ==========================================
// DELETE MESSAGE
// ==========================================

const deleteMessage = async (
  messageId,
  userId
) => {
  const message =
    await Message.findOne({
      _id: messageId,
      sender: userId,
    });

  if (!message) {
    const error = new Error(
      "Message not found or you are not allowed to delete it"
    );

    error.statusCode = 404;
    throw error;
  }

  await Message.findByIdAndDelete(
    messageId
  );

  return true;
};


// ==========================================
// UNREAD MESSAGE COUNT
// ==========================================

const getUnreadMessageCount = async (
  userId
) => {
  return await Message.countDocuments({
    receiver: userId,
    isRead: false,
  });
};


module.exports = {
  sendMessage,
  getConversation,
  getConversations,
  markConversationAsRead,
  markMessageAsRead,
  deleteMessage,
  getUnreadMessageCount,
};