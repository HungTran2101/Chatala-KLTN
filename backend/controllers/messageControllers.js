const asyncHandler = require("express-async-handler");
const Messages = require("../models/messageModel");
const Rooms = require("../models/roomModel");

const sendMessage = asyncHandler(async (req, res, next) => {
  const io = req.io;
  const id = req.user._id;
  const { roomId, msg, files } = req.body;

  const result = await Messages.create({
    roomId,
    senderId: id,
    msg,
    files,
  });
  if (result) {
    const lastMsg = msg !== "" ? msg : files[files.length - 1].name;
    await Rooms.findByIdAndUpdate(roomId, { lastMsg }, { new: true });
    io.emit("newLastMsg", {
      files,
      lastMsg,
      roomId,
    });
  }

  io.in(roomId).emit("receiveMessage", result);

  res.status(200).json({
    result,
    message: "Send Message Successfully!",
  });
});

const unSendMessage = asyncHandler(async (req, res, next) => {
  const { msgId } = req.params;

  const result = await Messages.findByIdAndUpdate(
    msgId,
    { unSend: true },
    { new: true }
  );

  res.status(200).json({
    result,
    message: "unSend Message Successfully!",
  });
});

const deleteMessage = asyncHandler(async (req, res, next) => {
  const { msgId } = req.params;

  const result = await Messages.findByIdAndUpdate(
    msgId,
    { deleted: true },
    { new: true }
  );

  res.status(200).json({
    result,
    message: "Delete Message Successfully!",
  });
});

module.exports = { sendMessage, unSendMessage, deleteMessage };
