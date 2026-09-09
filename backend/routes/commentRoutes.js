const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  create,
  getComments,
  remove
} = require("../controllers/commentController");

// ==========================================
// CREATE COMMENT / REPLY
// POST /api/comments/:postId
// ==========================================

router.post(
  "/:postId",
  protect,
  create
);


// ==========================================
// GET COMMENTS
// GET /api/comments/:postId
// ==========================================

router.get(
  "/:postId",
  protect,
  getComments
);


// ==========================================
// DELETE COMMENT
// DELETE /api/comments/:commentId
// ==========================================

router.delete(
  "/:commentId",
  protect,
  remove
);


module.exports = router;