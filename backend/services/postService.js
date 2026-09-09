const Post = require("../models/Post");


// ======================================
// CREATE POST
// ======================================
const create = async (
  userId,
  content = "",
  image = "",
  video = "",
  visibility = "public"
) => {
  const post = await Post.create({
    author: userId,
    content,
    image,
    video,
    visibility
  });

  return await Post.findById(post._id)
    .populate(
      "author",
      "name username profilePicture"
    );
};


// ======================================
// GET ALL POSTS
// ======================================
const getPosts = async (userId) => {
  const posts = await Post.find({
    $or: [
      { visibility: "public" },
      {
        visibility: "private",
        author: userId
      }
    ]
  })
    .populate(
      "author",
      "name username profilePicture"
    )
    .populate(
      "likes",
      "name username"
    )
    .sort({
      createdAt: -1
    });

  return posts;
};


// ======================================
// GET SINGLE POST
// ======================================
const getOne = async (postId) => {
  const post = await Post.findById(postId)
    .populate(
      "author",
      "name username profilePicture"
    )
    .populate(
      "likes",
      "name username"
    );

  if (!post) {
    const error = new Error(
      "Post not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return post;
};


// ======================================
// UPDATE POST
// ======================================
const update = async (
  postId,
  userId,
  data
) => {
  const post = await Post.findOne({
    _id: postId,
    author: userId
  });

  if (!post) {
    const error = new Error(
      "Post not found or unauthorized"
    );

    error.statusCode = 404;

    throw error;
  }

  if (
    data.content !== undefined
  ) {
    post.content = data.content;
  }

  if (
    data.visibility !== undefined
  ) {
    post.visibility =
      data.visibility;
  }

  post.isEdited = true;

  await post.save();

  return await Post.findById(post._id)
    .populate(
      "author",
      "name username profilePicture"
    );
};


// ======================================
// DELETE POST
// ======================================
const remove = async (
  postId,
  userId
) => {
  const post = await Post.findOne({
    _id: postId,
    author: userId
  });

  if (!post) {
    const error = new Error(
      "Post not found or unauthorized"
    );

    error.statusCode = 404;

    throw error;
  }

  await Post.findByIdAndDelete(
    postId
  );

  return true;
};


// ======================================
// LIKE POST
// ======================================
const like = async (
  postId,
  userId
) => {
  const post = await Post.findById(
    postId
  );

  if (!post) {
    const error = new Error(
      "Post not found"
    );

    error.statusCode = 404;

    throw error;
  }

  const alreadyLiked =
    post.likes.some(
      (id) =>
        id.toString() ===
        userId.toString()
    );

  if (!alreadyLiked) {
    post.likes.push(userId);
    post.likesCount =
      post.likes.length;

    await post.save();
  }

  return post;
};


// ======================================
// UNLIKE POST
// ======================================
const unlike = async (
  postId,
  userId
) => {
  const post = await Post.findById(
    postId
  );

  if (!post) {
    const error = new Error(
      "Post not found"
    );

    error.statusCode = 404;

    throw error;
  }

  post.likes =
    post.likes.filter(
      (id) =>
        id.toString() !==
        userId.toString()
    );

  post.likesCount =
    post.likes.length;

  await post.save();

  return post;
};


// ======================================
// EXPORTS
// ======================================
module.exports = {
  create,
  getPosts,
  getOne,
  update,
  remove,
  like,
  unlike
};