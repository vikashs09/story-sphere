const {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  searchUsers,
  getAllUsers,
} = require("../services/userService");

const {
  createFollowNotification,
} = require("../services/notificationService");

const {
  sendSuccess,
} = require("../utils/response");


// ======================================
// GET USER PROFILE
// GET /api/users/:userId
// ======================================

const getProfile = async (req, res, next) => {
  try {
    const user = await getUserProfile(
      req.params.userId
    );

    return sendSuccess(
      res,
      200,
      "User profile fetched successfully",
      {
        user,
      }
    );
  } catch (error) {
    next(error);
  }
};


// ======================================
// UPDATE USER PROFILE
// PUT /api/users/profile
// ======================================

const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      username,
      bio,
    } = req.body;

    const profilePicture = req.file
      ? `/uploads/profile/${req.file.filename}`
      : undefined;

    const user = await updateUserProfile(
      req.user._id,
      {
        name,
        username,
        bio,
        profilePicture,
      }
    );

    return sendSuccess(
      res,
      200,
      "Profile updated successfully",
      {
        user,
      }
    );
  } catch (error) {
    next(error);
  }
};


// ======================================
// FOLLOW USER
// POST /api/users/:userId/follow
// ======================================

const follow = async (req, res, next) => {
  try {
    const result = await followUser(
      req.user._id,
      req.params.userId
    );

    // Create notification
    if (
      result.followedUser &&
      result.followedUser._id.toString() !==
        req.user._id.toString()
    ) {
      await createFollowNotification({
        recipient:
          result.followedUser._id,

        sender:
          req.user._id,
      });
    }

    return sendSuccess(
      res,
      200,
      "User followed successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};


// ======================================
// UNFOLLOW USER
// DELETE /api/users/:userId/follow
// ======================================

const unfollow = async (req, res, next) => {
  try {
    const result = await unfollowUser(
      req.user._id,
      req.params.userId
    );

    return sendSuccess(
      res,
      200,
      "User unfollowed successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};


// ======================================
// SEARCH USERS
// GET /api/users/search?query=vikash
// ======================================

const search = async (req, res, next) => {
  try {
    const query =
      req.query.query ||
      req.query.q ||
      "";

    const users = await searchUsers(
      query
    );

    return sendSuccess(
      res,
      200,
      "Users fetched successfully",
      {
        users,
      }
    );
  } catch (error) {
    next(error);
  }
};


// ======================================
// GET ALL USERS
// GET /api/users
// Used for Messaging
// ======================================

const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers(
      req.user._id
    );

    return sendSuccess(
      res,
      200,
      "Users fetched successfully",
      {
        users,
      }
    );
  } catch (error) {
    next(error);
  }
};


// ======================================
// EXPORT
// ======================================

module.exports = {
  getProfile,
  updateProfile,
  follow,
  unfollow,
  search,
  getUsers,
};