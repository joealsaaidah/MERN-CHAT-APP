const express = require("express");
const connectToDB = require("./config/db");
const { chats } = require("./data/data");
const dotenv = require("dotenv").config();
const colors = require("colors");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

connectToDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`.bold.blue.underline)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  // oce user connected
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(`${userData.name} joined the chat`);
    socket.emit("connected");
  });
  // joining a room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`user has joined the room` + room);
  });

  // typing / stop typing
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  //send/recieve a message
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});
