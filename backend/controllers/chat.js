//getAllChat,
//createGroupChat,
//updateGroupChat,
//removeFromGroupChat,
//addToGroupChat,

const asyncHandler = require("express-async-handler");
const Chat = require("../Models/chat");
const User = require("../Models/user");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("userId not sent");
    return res.sendStatus(400);
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      isGroupChat: false,
      users: [req.user._id, userId],
      chatName: "sender",
    };
    try {
      const CreatedChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: CreatedChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const getAllChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("groupAdmin", "-password")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { name, users } = req.body;
  if (!name || !users) {
    return res.status(400).send({ message: "Please provide name and users" });
  }

  var usersInGroup = JSON.parse(users);
  if (usersInGroup.length < 2) {
    return res
      .status(400)
      .send({ message: "More than 2 users are required to form a group chat" });
  }
  // add the current user
  usersInGroup.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: name,
      isGroupChat: true,
      groupAdmin: req.user,
      users: usersInGroup,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).send(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatName, chatId } = req.body;
  if (!chatName || !chatId) {
    return res.status(400).send({ message: "Please provide name and chatId" });
  }

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      { _id: chatId },
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(400);
      throw new Error("Chat not found");
    } else {
      res.status(200).send(updatedChat);
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { accessChat, getAllChats, createGroupChat, renameGroupChat };
