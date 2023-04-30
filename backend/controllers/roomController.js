const asyncHandler = require("express-async-handler");
const Rooms = require("../models/roomModel");
const Messages = require("../models/messageModel");
const ErrorHandler = require("../utils/errorHandler");
const Users = require("../models/userModel");
const mongoose = require("mongoose");
const Files = require("../models/fileModel");

const createRoom = asyncHandler(async (req, res, next) => {
  const { isGroup, users } = req.body;

  if (users.every((user) => user.uid.toString() !== req.user._id.toString())) {
    users.push({
      uid: req.user._id,
      role: true,
      nickname: req.user.name,
    });
  } else {
    return next(new ErrorHandler("Group member cannot include creator!", 400));
  }

  let roomToCreate = {};
  roomToCreate.users = users;

  if (isGroup) {
    if (users.length < 3) {
      return next(
        new ErrorHandler(
          "Create group chat but receive less than 2 members!",
          400
        )
      );
    }

    let groupName = users[0].nickname;
    for (let i = 1; i < users.length; i++) {
      if (i < 3) {
        groupName = groupName + ", " + users[i].nickname;
      }
    }
    if (users.length > 3) {
      groupName += "...";
    }
    roomToCreate.groupName = groupName;
    roomToCreate.isGroup = true;
  } else if (users.length > 2) {
    return next(
      new ErrorHandler(
        "Create non-group chat but receive more than 1 member!",
        400
      )
    );
  }

  const createdRoom = await Rooms.create(roomToCreate);

  res.status(200).json(createdRoom);
});

const addAvatarForUserInRoom = (room, userInfos) => {
  let editedUsers = [];
  room.users.map((user) => {
    const avatar = userInfos.find(
      (it) => it._id.toString() === user.uid.toString()
    ).avatar;
    editedUsers.push({ ...user.toObject(), avatar });
  });

  return editedUsers;
};
const getRoomList = asyncHandler(async (req, res, next) => {
  const rooms = await Rooms.find({ "users.uid": req.user._id });

  //get all uid have in all rooms
  let uids = [];
  rooms.forEach((room) => {
    room.users.forEach((user) => uids.push(user.uid));
  });

  //get user info of each uid in uids above
  const userInfos = await Users.find({ _id: { $in: uids } });

  //add avatar property to each user in each room
  let editedRooms = [];
  rooms.map((room) => {
    let editedUsers = addAvatarForUserInRoom(room, userInfos);
    editedRooms.push({ ...room.toObject(), users: editedUsers });
  });

  let result = [];
  editedRooms.forEach((room) => {
    if (room.isGroup) {
      result.push({ roomName: room.groupName, roomAvatar: "", roomInfo: room });
    } else {
      let roomName = room.users[0].nickname;
      let roomAvatar = room.users[0].avatar;
      if (room.users[0].uid.toString() === req.user._id.toString()) {
        roomName = room.users[1].nickname;
        roomAvatar = room.users[1].avatar;
      }
      result.push({ roomName, roomAvatar, roomInfo: room });
    }
  });

  res.status(200).json({
    result,
  });
});

const getRoomInfo = asyncHandler(async (req, res, next) => {
  const roomId = req.params.roomId;

  const roomInfo = await Rooms.findById(roomId);
  const messages = await Messages.find({
    roomId: roomId,
  }).sort({ createdAt: -1 });
  const files = await Files.find({ roomId: roomId });

  // //add avatar for each user in room
  // let uids = [];
  // roomInfo.users.forEach((user) => uids.push(user.uid));
  // const userInfos = await Users.find({ _id: { $in: uids } });
  // const editedUsers = addAvatarForUserInRoom(roomInfo, userInfos);
  // const editedRoomInfo = { ...roomInfo.toObject(), users: editedUsers };

  // //setup response value
  // let roomAvatar = editedRoomInfo.users[0].avatar;
  // let roomName = editedRoomInfo.users[0].nickname;

  // if (editedRoomInfo.isGroup) {
  //   roomAvatar = "";
  //   roomName = "";
  // } else if (
  //   editedRoomInfo.users[1].uid.toString() !== req.user._id.toString()
  // ) {
  //   roomAvatar = editedRoomInfo.users[1].avatar;
  //   roomName = editedRoomInfo.users[1].nickname;
  // }

  if (messages && files) {
    res.status(200).json({
      messages,
      files,
    });
  } else {
    return next(new ErrorHandler("Room not found!", 404));
  }
});

const changeRoomName = asyncHandler(async (req, res, next) => {
  const roomId = req.params.roomId;
  const { groupName } = req.body;

  const room = await Rooms.findOneAndUpdate(
    { _id: roomId },
    { $set: { groupName } },
    {
      new: true,
    }
  );

  res.status(200).json({
    room,
  });
});

const setNickname = asyncHandler(async (req, res, next) => {
  const roomId = req.params.roomId;
  const { uid, nickname } = req.body;

  const room = await Rooms.findOneAndUpdate(
    { _id: roomId, "users.uid": uid },
    { $set: { "users.$.nickname": nickname } },
    {
      new: true,
    }
  );

  res.status(200).json({
    room,
  });
});

const addMember = asyncHandler(async (req, res, next) => {
  const roomId = req.params.roomId;
  const { uid } = req.body;

  const getMember = await Users.findById({ _id: uid });

  const getRoom = await Rooms.findById({ _id: roomId });

  const findUser = getRoom.users.filter((value) => {
    return value.uid == uid;
  });

  if (findUser.length > 0) {
    return next(
      new ErrorHandler(`${getMember.name} was added to the group!`, 400)
    );
  } else {
    const newMember = await Rooms.findOneAndUpdate(
      { _id: roomId },
      {
        $push: {
          users: {
            uid: uid,
            role: false,
            nickname: getMember.name,
          },
        },
      },
      {
        new: true,
        upsert: true,
      }
    );
    res.status(200).json({
      newMember,
    });
  }
});

const increaseUnreadMsg = asyncHandler(async (req, res, next) => {
  const { senderId, roomId } = req.body;

  if (!roomId) return next(new ErrorHandler("roomId is required", 400));

  try {
    await Rooms.findByIdAndUpdate(
      { _id: roomId },
      { $inc: { "users.$[user].unReadMsg": 1 } },
      { arrayFilters: [{ "user.uid": { $ne: senderId } }] }
    );
    return res.status(200).json("increase unread successful");
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Increase unread message failed" });
  }
});

const userSeenRoom = asyncHandler(async (req, res, next) => {
  const { uid, roomId } = req.body;

  if (!roomId) return next(new ErrorHandler("roomId is required", 400));
  if (!uid) return next(new ErrorHandler("uid is required", 400));

  try {
    await Rooms.findOneAndUpdate(
      { _id: roomId, "users.uid": uid },
      { $set: { "users.$.unReadMsg": 0 } }
    );
    return res.status(200).json("User seen room successful");
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "User seen room failed" });
  }
});

module.exports = {
  createRoom,
  getRoomList,
  getRoomInfo,
  changeRoomName,
  setNickname,
  addMember,
  increaseUnreadMsg,
  userSeenRoom,
};
