const express = require("express");

const router = express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const {
  send,
  getMessages,
  markAsRead,
  unreadCount,
  remove,
  stream,
} = require(
  "../controllers/messageController"
);

const upload = require(
  "../middleware/chatUpload"
);

// ==========================================
// UNREAD COUNT
// IMPORTANT: keep before /:userId
// ==========================================

router.get(
  "/unread",
  protect,
  unreadCount
);

// ==========================================
// REAL-TIME STREAM
// ==========================================
router.get(
  "/stream",
  protect,
  stream
);

// ==========================================
// SEND MESSAGE
// ==========================================

router.post(
  "/",
  protect,
  upload.single("file"),
  send
);

// ==========================================
// GET CONVERSATION
// ==========================================

router.get(
  "/:userId",
  protect,
  getMessages
);

// ==========================================
// MARK CONVERSATION AS READ
// ==========================================

router.patch(
  "/:userId/read",
  protect,
  markAsRead
);

// ==========================================
// DELETE MESSAGE
// ==========================================

router.delete(
  "/:messageId",
  protect,
  remove
);

module.exports = router;