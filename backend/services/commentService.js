const Comment = require("../models/Comment");
const Post = require("../models/Post");

const createComment = async (postId, userId, content, parentComment = null) => {
  const post = await Post.findById(postId);

  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  if (!content || !content.trim()) {
    const error = new Error("Comment cannot be empty");
    error.statusCode = 400;
    throw error;
  }

  if (parentComment) {
    const parent = await Comment.findOne({
      _id: parentComment,
      post: postId
    });

    if (!parent) {
      const error = new Error("Parent comment not found");
      error.statusCode = 404;
      throw error;
    }
  }

  const comment = await Comment.create({
    post: postId,
    author: userId,
    content: content.trim(),
    parentComment: parentComment || null
  });

  await Post.findByIdAndUpdate(postId, {
    $inc: { commentsCount: 1 }
  });

  return await Comment.findById(comment._id).populate(
    "author",
    "name username profilePicture"
  );
};

const getPostComments = async (postId) => {
  const post = await Post.findById(postId);

  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  return await Comment.find({
    post: postId
  })
    .populate(
      "author",
      "name username profilePicture"
    )
    .sort({ createdAt: 1 });
};

const deleteComment = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    const error = new Error("Comment not found");
    error.statusCode = 404;
    throw error;
  }

  if (comment.author.toString() !== userId.toString()) {
    const error = new Error(
      "You can only delete your own comment"
    );

    error.statusCode = 403;
    throw error;
  }

  const postId = comment.post;

  const deletedComments = await Comment.deleteMany({
    $or: [
      { _id: commentId },
      { parentComment: commentId }
    ]
  });

  await Post.findByIdAndUpdate(postId, {
    $inc: {
      commentsCount: -deletedComments.deletedCount
    }
  });

  return true;
};

module.exports = {
  createComment,
  getPostComments,
  deleteComment
};