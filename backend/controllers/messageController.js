const {
  sendMessage,
  getConversation,
  markMessagesAsRead,
  getUnreadCount,
  deleteMessage,
} = require("../services/chatService");

const {
  createMessageNotification,
} = require("../services/notificationService");

const {
  sendSuccess,
} = require("../utils/response");

const { subscribe, publish, heartbeat } = require("../services/realtimeService");


// ======================================
// SEND MESSAGE
// POST /api/messages
// ======================================

const send = async (
  req,
  res,
  next
) => {
  try {

    const {
      receiverId,
      content = "",
    } = req.body;


    const file =
      req.file
        ? `/uploads/chat/${req.file.filename}`
        : "";


    let fileType = "";


    if (req.file) {

      if (
        req.file.mimetype.startsWith(
          "image/"
        )
      ) {
        fileType = "image";

      } else if (
        req.file.mimetype.startsWith(
          "video/"
        )
      ) {
        fileType = "video";

      } else {
        fileType = "file";
      }
    }


    const message =
      await sendMessage(
        req.user._id,
        receiverId,
        content,
        file,
        fileType
      );


    publish([req.user._id, receiverId], "message", { message });

    // Notification
    try {

      await createMessageNotification({
        receiver: receiverId,
        sender: req.user._id,
        message,
      });

    } catch (notificationError) {

      console.error(
        "Message notification error:",
        notificationError
      );

    }


    return sendSuccess(
      res,
      201,
      "Message sent successfully",
      {
        message,
      }
    );

  } catch (error) {
    next(error);
  }
};


// ======================================
// REAL-TIME MESSAGE STREAM
// GET /api/messages/stream
// ======================================
const stream = async (req, res) => {
  res.status(200);
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();
  res.write(`event: ready\ndata: ${JSON.stringify({ connected: true })}\n\n`);
  const unsubscribe = subscribe(req.user._id, res);
  const interval = setInterval(() => heartbeat(res), 25000);
  req.on("close", () => { clearInterval(interval); unsubscribe(); });
};

// ======================================
// GET MESSAGES
// GET /api/messages/:userId
// ======================================

const getMessages = async (
  req,
  res,
  next
) => {
  try {

    const messages =
      await getConversation(
        req.user._id,
        req.params.userId
      );


    return sendSuccess(
      res,
      200,
      "Messages fetched successfully",
      {
        messages,
      }
    );

  } catch (error) {
    next(error);
  }
};


// ======================================
// MARK AS READ
// PATCH /api/messages/:userId/read
// ======================================

const markAsRead = async (
  req,
  res,
  next
) => {
  try {

    await markMessagesAsRead(
      req.user._id,
      req.params.userId
    );


    return sendSuccess(
      res,
      200,
      "Messages marked as read"
    );

  } catch (error) {
    next(error);
  }
};


// ======================================
// UNREAD COUNT
// GET /api/messages/unread-count
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
      "Unread message count fetched successfully",
      {
        count,
      }
    );

  } catch (error) {
    next(error);
  }
};


// ======================================
// DELETE MESSAGE
// DELETE /api/messages/:messageId
// ======================================

const remove = async (
  req,
  res,
  next
) => {
  try {

    await deleteMessage(
      req.params.messageId,
      req.user._id
    );


    return sendSuccess(
      res,
      200,
      "Message deleted successfully"
    );

  } catch (error) {
    next(error);
  }
};


// ======================================
// EXPORT
// ======================================

module.exports = {
  send,
  getMessages,
  markAsRead,
  unreadCount,
  remove,
  stream,
};