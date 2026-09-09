const mongoose = require("mongoose");

const messageSchema =
  new mongoose.Schema(
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      content: {
        type: String,
        trim: true,
        default: "",
      },

      file: {
        type: String,
        default: "",
      },

      fileType: {
        type: String,
        enum: [
          "",
          "image",
          "video",
          "file",
        ],
        default: "",
      },

      isRead: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );


// ======================================
// INDEXES
// ======================================

messageSchema.index({
  sender: 1,
  receiver: 1,
  createdAt: 1,
});

messageSchema.index({
  receiver: 1,
  isRead: 1,
});


module.exports =
  mongoose.model(
    "Message",
    messageSchema
  );