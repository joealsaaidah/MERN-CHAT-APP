const express = require("express");
const connectToDB = require("./config/db");
const { chats } = require("./data/data");
const dotenv = require("dotenv").config();
const colors = require("colors");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

connectToDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`.bold.blue.underline)
);
