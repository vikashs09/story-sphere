const mongoose = require("mongoose");

const Message =
  require("../models/Message");

const User =
  require("../models/User");


// ======================================
// SEND MESSAGE
// ======================================

const sendMessage = async (
  senderId,
  receiverId,
  content = "",
  file = "",
  fileType = ""
) => {

  if (!receiverId) {
    const error =
      new Error(
        "Receiver ID is required"
      );

    error.statusCode = 400;

    throw error;
  }


  if (
    !mongoose.Types.ObjectId.isValid(
      receiverId
    )
  ) {
    const error =
      new Error(
        "Invalid receiver ID"
      );

    error.statusCode = 400;

    throw error;
  }


  if (
    senderId.toString() ===
    receiverId.toString()
  ) {
    const error =
      new Error(
        "You cannot message yourself"
      );

    error.statusCode = 400;

    throw error;
  }


  const receiver =
    await User.findById(
      receiverId
    );


  if (!receiver) {
    const error =
      new Error(
        "Receiver not found"
      );

    error.statusCode = 404;

    throw error;
  }


  const cleanContent =
    String(content || "").trim();


  if (
    !cleanContent &&
    !file
  ) {
    const error =
      new Error(
        "Message content or file is required"
      );

    error.statusCode = 400;

    throw error;
  }


  const message =
    await Message.create({
      sender: senderId,
      receiver: receiverId,
      content: cleanContent,
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


// ======================================
// GET CONVERSATION
// ======================================

const getConversation = async (
  currentUserId,
  otherUserId
) => {

  if (
    !mongoose.Types.ObjectId.isValid(
      otherUserId
    )
  ) {
    const error =
      new Error(
        "Invalid user ID"
      );

    error.statusCode = 400;

    throw error;
  }


  const otherUser =
    await User.findById(
      otherUserId
    );


  if (!otherUser) {
    const error =
      new Error(
        "User not found"
      );

    error.statusCode = 404;

    throw error;
  }


  const messages =
    await Message.find({
      $or: [
        {
          sender: currentUserId,
          receiver: otherUserId,
        },
        {
          sender: otherUserId,
          receiver: currentUserId,
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


// ======================================
// MARK MESSAGES AS READ
// ======================================

const markMessagesAsRead = async (
  currentUserId,
  otherUserId
) => {

  await Message.updateMany(
    {
      sender: otherUserId,
      receiver: currentUserId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
      },
    }
  );


  return true;
};


// ======================================
// GET UNREAD COUNT
// ======================================

const getUnreadCount = async (
  currentUserId
) => {

  const count =
    await Message.countDocuments({
      receiver: currentUserId,
      isRead: false,
    });


  return count;
};


// ======================================
// DELETE MESSAGE
// ======================================

const deleteMessage = async (
  messageId,
  currentUserId
) => {

  if (
    !mongoose.Types.ObjectId.isValid(
      messageId
    )
  ) {
    const error =
      new Error(
        "Invalid message ID"
      );

    error.statusCode = 400;

    throw error;
  }


  const message =
    await Message.findById(
      messageId
    );


  if (!message) {
    const error =
      new Error(
        "Message not found"
      );

    error.statusCode = 404;

    throw error;
  }


  if (
    message.sender.toString() !==
    currentUserId.toString()
  ) {
    const error =
      new Error(
        "You can only delete your own messages"
      );

    error.statusCode = 403;

    throw error;
  }


  await Message.findByIdAndDelete(
    messageId
  );


  return true;
};


// ======================================
// EXPORT
// ======================================

module.exports = {
  sendMessage,
  getConversation,
  markMessagesAsRead,
  getUnreadCount,
  deleteMessage,
};