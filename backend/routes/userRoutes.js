const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
  follow,
  unfollow,
  search,
  getUsers,
} = require("../controllers/userController");


// ======================================
// SEARCH USERS
// GET /api/users/search?query=vikash
// IMPORTANT: Keep before /:userId
// ======================================

router.get(
  "/search",
  protect,
  search
);


// ======================================
// GET ALL USERS
// GET /api/users
// Used for Messaging
// IMPORTANT: Keep before /:userId
// ======================================

router.get(
  "/",
  protect,
  getUsers
);


// ======================================
// UPDATE PROFILE
// PUT /api/users/profile
// ======================================

router.put(
  "/profile",
  protect,
  updateProfile
);


// ======================================
// GET USER PROFILE
// GET /api/users/:userId
// ======================================

router.get(
  "/:userId",
  protect,
  getProfile
);


// ======================================
// FOLLOW USER
// POST /api/users/:userId/follow
// ======================================

router.post(
  "/:userId/follow",
  protect,
  follow
);


// ======================================
// UNFOLLOW USER
// DELETE /api/users/:userId/follow
// ======================================

router.delete(
  "/:userId/follow",
  protect,
  unfollow
);


// ======================================
// EXPORT
// ======================================

module.exports = router;