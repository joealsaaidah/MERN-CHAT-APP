const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      required: true,
      default:
        "https://res.cloudinary.com/mimicucu/image/upload/v1644925682/MERN_CHAT_APP/default_profile_pic_cq2ub0.png",
    },
  },
  { timestamps: true }
);

const useModal = mongoose.model("User", userSchema);
module.exports = useModal;
