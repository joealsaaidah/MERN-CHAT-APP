const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { sendMessage, getAllMessages } = require("../controllers/message");

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, getAllMessages);

module.exports = router;
