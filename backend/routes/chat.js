const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();
const {
  accessChat,
  getAllChats,
  createGroupChat,
  renameGroupChat,
  removeFromGroupChat,
  addToGroupChat,
} = require("../controllers/chat");

router.route("/").post(protect, accessChat).get(protect, getAllChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroupChat);
router.route("/groupremove").put(protect, removeFromGroupChat);
router.route("/groupadd").put(protect, addToGroupChat);

module.exports = router;
