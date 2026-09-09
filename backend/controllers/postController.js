const {
  create,
  getPosts,
  getOne,
  update,
  remove,
  like,
  unlike
} = require("../services/postService");

const {
  createLikeNotification
} = require("../services/notificationService");

const {
  sendSuccess
} = require("../utils/response");


// ======================================
// CREATE POST
// ======================================
const createPost = async (
  req,
  res,
  next
) => {
  try {
    const {
      content = "",
      visibility = "public"
    } = req.body;

    const image =
      req.files?.image?.[0]
        ? `/uploads/posts/${req.files.image[0].filename}`
        : "";

    const video =
      req.files?.video?.[0]
        ? `/uploads/posts/${req.files.video[0].filename}`
        : "";

    const post = await create(
      req.user._id,
      content,
      image,
      video,
      visibility
    );

    return sendSuccess(
      res,
      201,
      "Post created successfully",
      { post }
    );
  } catch (error) {
    next(error);
  }
};


// ======================================
// GET ALL POSTS
// ======================================
const getPostsController = async (
  req,
  res,
  next
) => {
  try {
    const posts = await getPosts(
      req.user._id
    );

    return sendSuccess(
      res,
      200,
      "Posts fetched successfully",
      { posts }
    );
  } catch (error) {
    next(error);
  }
};


// ======================================
// GET SINGLE POST
// ======================================
const getPostById = async (
  req,
  res,
  next
) => {
  try {
    const post = await getOne(
      req.params.postId
    );

    return sendSuccess(
      res,
      200,
      "Post fetched successfully",
      { post }
    );
  } catch (error) {
    next(error);
  }
};


// ======================================
// UPDATE POST
// ======================================
const updatePost = async (
  req,
  res,
  next
) => {
  try {
    const {
      content,
      visibility
    } = req.body;

    const post = await update(
      req.params.postId,
      req.user._id,
      {
        content,
        visibility
      }
    );

    return sendSuccess(
      res,
      200,
      "Post updated successfully",
      { post }
    );
  } catch (error) {
    next(error);
  }
};


// ======================================
// DELETE POST
// ======================================
const deletePost = async (
  req,
  res,
  next
) => {
  try {
    await remove(
      req.params.postId,
      req.user._id
    );

    return sendSuccess(
      res,
      200,
      "Post deleted successfully"
    );
  } catch (error) {
    next(error);
  }
};


// ======================================
// LIKE POST
// ======================================
const likePost = async (
  req,
  res,
  next
) => {
  try {
    const post = await like(
      req.params.postId,
      req.user._id
    );

    if (
      post.author &&
      post.author.toString() !==
        req.user._id.toString()
    ) {
      await createLikeNotification({
        post,
        sender: req.user._id
      });
    }

    return sendSuccess(
      res,
      200,
      "Post liked successfully",
      { post }
    );
  } catch (error) {
    next(error);
  }
};


// ======================================
// UNLIKE POST
// ======================================
const unlikePost = async (
  req,
  res,
  next
) => {
  try {
    const post = await unlike(
      req.params.postId,
      req.user._id
    );

    return sendSuccess(
      res,
      200,
      "Post unliked successfully",
      { post }
    );
  } catch (error) {
    next(error);
  }
};


// ======================================
// EXPORTS
// ======================================
module.exports = {
  createPost,
  getPosts: getPostsController,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost
};