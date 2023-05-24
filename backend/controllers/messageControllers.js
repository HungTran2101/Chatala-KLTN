const asyncHandler = require('express-async-handler');
const Files = require('../models/fileModel');
const Messages = require('../models/messageModel');
const Rooms = require('../models/roomModel');
const ErrorHandler = require('../utils/errorHandler');

const getMessages = asyncHandler(async (req, res, next) => {
  const roomId = req.params.roomId;
  const limit = !isNaN(req.params.limit) ? parseInt(req.params.limit) : 20;
  const pageNum = !isNaN(req.params.pageNum) ? parseInt(req.params.pageNum) : 1;

  const messages = await Messages.find({
    roomId: roomId,
  })
    .sort({ createdAt: -1 })
    .skip(limit * pageNum - limit)
    .limit(limit);

  if (messages) {
    res.status(200).json({
      messages,
    });
  } else {
    return next(new ErrorHandler('Messages not found!', 404));
  }
});

const sendMessage = asyncHandler(async (req, res, next) => {
  const io = req.io;
  const id = req.user._id;
  const { roomId, msg, fileIds, replyId, mentions } = req.body;

  const result = await Messages.create({
    roomId,
    senderId: id,
    msg,
    replyId,
    fileIds,
    mentions,
  });

  if (result) {
    const lastMsg = msg !== '' ? msg : 'File';
    await Rooms.findByIdAndUpdate(roomId, { lastMsg }, { new: true });
    io.emit('newLastMsg', {
      lastMsg,
      roomId,
    });
  }

  io.in(roomId).emit('receiveMessage', result);
  io.emit('incUnreadMsg', result.senderId, roomId);

  res.status(200).json({
    result,
    message: 'Send Message Successfully!',
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
  return next(new ErrorHandler('No file exist!', 400));
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
    message: 'unSend Message Successfully!',
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
    message: 'Delete Message Successfully!',
  });
});

module.exports = {
  getMessages,
  sendMessage,
  saveFile,
  getFile,
  unSendMessage,
  deleteMessage,
};
