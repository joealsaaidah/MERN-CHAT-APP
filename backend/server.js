const express = require("express");
const { chats } = require("./data/data");
const dotenv = require("dotenv").config();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/chat", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  const singleChat = chats.find((chat) => chat._id === req.params.id);
  if (!singleChat) {
    res.status(404).send("The chat with the given ID was not found.");
  } else {
    res.send(singleChat);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
