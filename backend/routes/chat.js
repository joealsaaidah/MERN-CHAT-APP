const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();
const {
  accessChat,
  getAllChats,
  createGroupChat,
  updateGroupChat,
  removeFromGroupChat,
  addToGroupChat,
} = require("../controllers/chat");

router.route("/").post(protect, accessChat).get(protect, getAllChats);
/*router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, updateGroupChat);
router.route("/grouperemove").put(protect, removeFromGroupChat);
router.route("/groupeadd").put(protect, addToGroupChat); */

module.exports = router;
