const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Post author is required"]
    },

    content: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: ""
    },

    image: {
      type: String,
      default: ""
    },

    video: {
      type: String,
      default: ""
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    commentsCount: {
      type: Number,
      default: 0,
      min: 0
    },

    likesCount: {
      type: Number,
      default: 0,
      min: 0
    },

    isEdited: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

postSchema.index({
  author: 1,
  createdAt: -1
});

postSchema.index({
  visibility: 1,
  createdAt: -1
});

module.exports = mongoose.model(
  "Post",
  postSchema
);