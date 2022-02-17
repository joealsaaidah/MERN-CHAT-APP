const asyncHandler = require("express-async-handler");
const Message = require("../Models/message");
const User = require("../Models/user");
const Chat = require("../Models/chat");

const getAllMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.status(200).json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;
  if (!chatId || !content) {
    console.log("chatId or content is missing");
    return res.sendStatus(400);
  }
  var newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, getAllMessages };
