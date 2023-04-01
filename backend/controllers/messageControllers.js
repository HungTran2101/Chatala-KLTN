const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
const Files = require("../models/fileModel");
const Messages = require("../models/messageModel");
const Rooms = require("../models/roomModel");
const ErrorHandler = require("../utils/errorHandler");

const sendMessage = asyncHandler(async (req, res, next) => {
  const io = req.io;
  const id = req.user._id;
  const { roomId, msg, fileIds } = req.body;

  const result = await Messages.create({
    roomId,
    senderId: id,
    msg,
    fileIds,
  });

  if (result) {
    const lastMsg = msg !== "" ? msg : "File";
    await Rooms.findByIdAndUpdate(roomId, { lastMsg }, { new: true });
    io.emit("newLastMsg", {
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

const saveFile = asyncHandler(async (req, res, next) => {
  const { files } = req.body;

  if (files && files.length > 0) {
    const result = await Files.create(files);

    const fileIds = [];

    result.forEach((file) => fileIds.push(file._id));

    return res.status(200).json({
      fileIds,
    });
  }
  return next(new ErrorHandler("No file exist!", 400));
});

const getFile = asyncHandler(async (req, res) => {
  const { roomId } = req.body;

  const files = await Files.find({ roomId: roomId });

  res.status(200).json({
    files,
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

module.exports = { sendMessage, saveFile, getFile, unSendMessage, deleteMessage };
