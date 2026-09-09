const Post = require("../models/Post");

const {
  createComment,
  getPostComments,
  deleteComment
} = require("../services/commentService");

const {
  createCommentNotification
} = require("../services/notificationService");

const { sendSuccess } = require("../utils/response");


// ======================================
// CREATE COMMENT / REPLY
// POST /api/comments/:postId
// ======================================
const create = async (req, res, next) => {
  try {
    const {
      content,
      parentComment = null
    } = req.body;

    // Create comment
    const comment = await createComment(
      req.params.postId,
      req.user._id,
      content,
      parentComment
    );

    // Find post
    const post = await Post.findById(
      req.params.postId
    );

    // DEBUG LOGS
    console.log(
      "COMMENT CREATED:",
      comment
    );

    console.log(
      "POST AUTHOR:",
      post?.author
    );

    console.log(
      "COMMENT SENDER:",
      req.user._id
    );

    // Create notification
    if (post) {
      await createCommentNotification({
        post,
        sender: req.user._id,
        comment
      });

      console.log(
        "COMMENT NOTIFICATION CREATED"
      );
    }

    return sendSuccess(
      res,
      201,
      parentComment
        ? "Reply added successfully"
        : "Comment added successfully",
      {
        comment
      }
    );

  } catch (error) {
    console.error(
      "Create comment error:",
      error
    );

    next(error);
  }
};


// ======================================
// GET COMMENTS
// GET /api/comments/:postId
// ======================================
const getComments = async (
  req,
  res,
  next
) => {
  try {

    const comments =
      await getPostComments(
        req.params.postId
      );

    return sendSuccess(
      res,
      200,
      "Comments fetched successfully",
      {
        comments
      }
    );

  } catch (error) {

    console.error(
      "Get comments error:",
      error
    );

    next(error);
  }
};


// ======================================
// DELETE COMMENT
// DELETE /api/comments/:commentId
// ======================================
const remove = async (
  req,
  res,
  next
) => {
  try {

    await deleteComment(
      req.params.commentId,
      req.user._id
    );

    return sendSuccess(
      res,
      200,
      "Comment deleted successfully"
    );

  } catch (error) {

    console.error(
      "Delete comment error:",
      error
    );

    next(error);
  }
};


module.exports = {
  create,
  getComments,
  remove
};