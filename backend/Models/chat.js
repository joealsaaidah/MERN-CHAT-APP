const mongoose = require("mongoose");

// Define schema
const chatSchema = mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
      required: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Compile model from schema
const SomeModel = mongoose.model("Chat", chatSchema);
module.exports = SomeModel;
