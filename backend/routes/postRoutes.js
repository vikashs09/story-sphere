const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  uploadPost
} = require("../middleware/uploadMiddleware");

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost
} = require("../controllers/postController");


// ======================================
// GET ALL POSTS
// GET /api/posts
// ======================================
router.get(
  "/",
  protect,
  getPosts
);


// ======================================
// CREATE POST
// POST /api/posts
// ======================================
router.post(
  "/",
  protect,
  uploadPost,
  createPost
);


// ======================================
// GET SINGLE POST
// GET /api/posts/:postId
// ======================================
router.get(
  "/:postId",
  protect,
  getPostById
);


// ======================================
// UPDATE POST
// PUT /api/posts/:postId
// ======================================
router.put(
  "/:postId",
  protect,
  uploadPost,
  updatePost
);


// ======================================
// DELETE POST
// DELETE /api/posts/:postId
// ======================================
router.delete(
  "/:postId",
  protect,
  deletePost
);


// ======================================
// LIKE POST
// POST /api/posts/:postId/like
// ======================================
router.post(
  "/:postId/like",
  protect,
  likePost
);


// ======================================
// UNLIKE POST
// DELETE /api/posts/:postId/like
// ======================================
router.delete(
  "/:postId/like",
  protect,
  unlikePost
);


module.exports = router;