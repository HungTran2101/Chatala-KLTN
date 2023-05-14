const mongoose = require("mongoose");
const { COLLECTION_ROOMS } = require("../config/db");

const roomSchema = mongoose.Schema(
  {
    groupName: { type: String, trim: true, default: "" },
    isGroup: { type: Boolean, default: false },
    users: [
      {
        uid: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        role: { type: Boolean, default: false },
        nickname: { type: String, trim: true },
        unReadMsg: { type: Number, default: 0 },
      },
    ],
    lastMsg: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

const Rooms = mongoose.model("Rooms", roomSchema, COLLECTION_ROOMS);

module.exports = Rooms;
