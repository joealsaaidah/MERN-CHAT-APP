const express = require("express");
const { registerUser, loginUser, getAllUsers } = require("../controllers/user");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, getAllUsers);
router.route("/login").post(loginUser);

module.exports = router;
