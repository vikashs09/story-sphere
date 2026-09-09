const User = require("../models/User");

// ======================================
// GET USER PROFILE
// ======================================
const getUserProfile = async (userId) => {
  const user = await User.findById(userId)
    .select(
      "-password -refreshToken -resetPasswordToken -resetPasswordExpires"
    )
    .populate(
      "followers",
      "name username profilePicture"
    )
    .populate(
      "following",
      "name username profilePicture"
    );

  if (!user) {
    const error = new Error(
      "User not found"
    );

    error.statusCode = 404;
    throw error;
  }

  return user;
};


// ======================================
// UPDATE USER PROFILE
// ======================================
const updateUserProfile = async (
  userId,
  updates
) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error(
      "User not found"
    );

    error.statusCode = 404;
    throw error;
  }

  // ------------------------------
  // NAME
  // ------------------------------
  if (updates.name !== undefined) {
    user.name = updates.name.trim();
  }

  // ------------------------------
  // USERNAME
  // ------------------------------
  if (updates.username !== undefined) {
    const username =
      updates.username
        .trim()
        .toLowerCase();

    const existingUser =
      await User.findOne({
        username,
        _id: {
          $ne: userId
        }
      });

    if (existingUser) {
      const error = new Error(
        "Username already exists"
      );

      error.statusCode = 409;
      throw error;
    }

    user.username = username;
  }

  // ------------------------------
  // BIO
  // ------------------------------
  if (updates.bio !== undefined) {
    user.bio = updates.bio.trim();
  }

  // ------------------------------
  // PROFILE PICTURE
  // ------------------------------
  if (
    updates.profilePicture !==
    undefined
  ) {
    user.profilePicture =
      updates.profilePicture;
  }

  await user.save();

  return await User.findById(userId)
    .select(
      "-password -refreshToken -resetPasswordToken -resetPasswordExpires"
    );
};


// ======================================
// FOLLOW USER
// ======================================
const followUser = async (
  currentUserId,
  targetUserId
) => {

  // ------------------------------
  // PREVENT SELF FOLLOW
  // ------------------------------
  if (
    currentUserId.toString() ===
    targetUserId.toString()
  ) {
    const error = new Error(
      "You cannot follow yourself"
    );

    error.statusCode = 400;
    throw error;
  }

  // ------------------------------
  // FIND USERS
  // ------------------------------
  const currentUser =
    await User.findById(
      currentUserId
    );

  const targetUser =
    await User.findById(
      targetUserId
    );

  if (!currentUser) {
    const error = new Error(
      "Current user not found"
    );

    error.statusCode = 404;
    throw error;
  }

  if (!targetUser) {
    const error = new Error(
      "User to follow not found"
    );

    error.statusCode = 404;
    throw error;
  }

  // ------------------------------
  // CHECK ALREADY FOLLOWING
  // ------------------------------
  const alreadyFollowing =
    targetUser.followers.some(
      (id) =>
        id.toString() ===
        currentUserId.toString()
    );

  if (alreadyFollowing) {
    const error = new Error(
      "You are already following this user"
    );

    error.statusCode = 400;
    throw error;
  }

  // ------------------------------
  // ADD TO FOLLOWING
  // ------------------------------
  await User.findByIdAndUpdate(
    currentUserId,
    {
      $addToSet: {
        following: targetUserId
      }
    }
  );

  // ------------------------------
  // ADD TO FOLLOWERS
  // ------------------------------
  await User.findByIdAndUpdate(
    targetUserId,
    {
      $addToSet: {
        followers: currentUserId
      }
    }
  );

  // ------------------------------
  // GET UPDATED USER
  // ------------------------------
  const updatedTargetUser =
    await User.findById(
      targetUserId
    ).select(
      "name username profilePicture followers following"
    );

  return {
    followed: true,

    followedUser:
      updatedTargetUser,

    followersCount:
      updatedTargetUser.followers.length
  };
};


// ======================================
// UNFOLLOW USER
// ======================================
const unfollowUser = async (
  currentUserId,
  targetUserId
) => {

  // ------------------------------
  // FIND USERS
  // ------------------------------
  const currentUser =
    await User.findById(
      currentUserId
    );

  const targetUser =
    await User.findById(
      targetUserId
    );

  if (!currentUser) {
    const error = new Error(
      "Current user not found"
    );

    error.statusCode = 404;
    throw error;
  }

  if (!targetUser) {
    const error = new Error(
      "User not found"
    );

    error.statusCode = 404;
    throw error;
  }

  // ------------------------------
  // CHECK FOLLOWING
  // ------------------------------
  const isFollowing =
    targetUser.followers.some(
      (id) =>
        id.toString() ===
        currentUserId.toString()
    );

  if (!isFollowing) {
    const error = new Error(
      "You are not following this user"
    );

    error.statusCode = 400;
    throw error;
  }

  // ------------------------------
  // REMOVE FROM FOLLOWING
  // ------------------------------
  await User.findByIdAndUpdate(
    currentUserId,
    {
      $pull: {
        following: targetUserId
      }
    }
  );

  // ------------------------------
  // REMOVE FROM FOLLOWERS
  // ------------------------------
  await User.findByIdAndUpdate(
    targetUserId,
    {
      $pull: {
        followers: currentUserId
      }
    }
  );

  // ------------------------------
  // GET UPDATED USER
  // ------------------------------
  const updatedTargetUser =
    await User.findById(
      targetUserId
    ).select(
      "name username profilePicture followers following"
    );

  return {
    followed: false,

    unfollowedUser:
      updatedTargetUser,

    followersCount:
      updatedTargetUser.followers.length
  };
};


// ======================================
// SEARCH USERS
// ======================================
const searchUsers = async (
  query
) => {

  const cleanQuery =
    query.trim();

  // ------------------------------
  // EMPTY SEARCH
  // ------------------------------
  if (!cleanQuery) {
    return [];
  }

  // ------------------------------
  // SEARCH BY NAME / USERNAME
  // ------------------------------
  const users = await User.find({
    $or: [
      {
        name: {
          $regex: cleanQuery,
          $options: "i"
        }
      },
      {
        username: {
          $regex: cleanQuery,
          $options: "i"
        }
      }
    ]
  })
    .select(
      "name username profilePicture bio"
    )
    .limit(20);

  return users;
};


// ======================================
// GET ALL USERS FOR MESSAGING
// GET /api/users
// ======================================
const getAllUsers = async (
  currentUserId
) => {

  const users = await User.find({
    _id: {
      $ne: currentUserId
    }
  })
    .select(
      "name username profilePicture bio"
    )
    .sort({
      name: 1
    });

  return users;
};


// ======================================
// EXPORT
// ======================================
module.exports = {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  searchUsers,
  getAllUsers
};