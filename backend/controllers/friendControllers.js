const asyncHandler = require('express-async-handler');
const Notifications = require('../models/notificationModel');
const Friends = require('../models/friendModel');
const ErrorHandler = require('../utils/errorHandler');
const Users = require('../models/userModel');
const Rooms = require('../models/roomModel');

const getFriendRequestList = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  let listRequest = [];

  const listPending = await Notifications.find({
    receiveId: id,
    status: 'Pending',
  });

  for (const pending of listPending) {
    if (pending.receiveId.toString() === id.toString()) {
      let getUser = await Users.findById(pending.requestId);
      listRequest.push({
        _id: pending._id,
        uid: pending.requestId,
        name: getUser.name,
        avatar: getUser.avatar,
        banner: getUser.banner,
        phone: getUser.phone,
        gender: getUser.gender,
        dob: getUser.dob,
        createdAt: pending.createdAt,
        updatedAt: pending.updatedAt,
      });
    }
  }

  res.status(200).json(listRequest);
});

const friendReq = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const receiveId = req.params.id;

  const friend = await Friends.findOne({
    $or: [
      {
        uid1: id,
        uid2: receiveId,
      },
      {
        uid1: receiveId,
        uid2: id,
      },
    ],
  });
  if (!friend) {
    await Notifications.create({
      receiveId: receiveId,
      requestId: id,
    });
    return res.status(200).json({
      receiveId,
    });
  } else {
    return next(new ErrorHandler('Already friend!', 400));
  }
});

const friendAccept = asyncHandler(async (req, res, next) => {
  const notificationId = req.params.id;
  const notification = await Notifications.findById(notificationId);
  const inRelationship = await Friends.findOne({
    $or: [
      {
        uid1: notification.requestId,
        uid2: notification.receiveId,
      },
      {
        uid1: notification.receiveId,
        uid2: notification.requestId,
      },
    ],
  });
  if (notification && notification.status == 'Pending' && !inRelationship) {
    await Notifications.findByIdAndUpdate(notificationId, {
      $set: {
        status: 'Accepted',
      },
    });
    const friendRelate = await Friends.create({
      uid1: notification.requestId,
      uid2: notification.receiveId,
    });

    return res.status(200).json({
      message: 'Accept successfully',
      friendRelate,
    });
  } else {
    return next(new ErrorHandler('Unhandled error!', 500));
  }
});

const friendDecline = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  await Notifications.findByIdAndUpdate(id, {
    $set: {
      status: 'Denied',
    },
  });

  return res.status(200).json({
    message: 'Decline successfully',
  });
});

const block = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const targetId = req.params.id;

  console.log(targetId);
  console.log(id);

  const friend = await Friends.findOne({
    $or: [
      {
        uid1: id,
        uid2: targetId,
      },
      {
        uid1: targetId,
        uid2: id,
      },
    ],
  });
  console.log(friend);

  if (!friend) {
    await Friends.create({
      uid1: id,
      uid2: targetId,
      status: {
        type: 'oneWayBlock',
        blockedId: targetId,
      },
    });
    return res.status(200).json({
      message: 'Block successfully',
    });
  } else {
    return res.status(500).json({
      message: 'Not friend',
    });
  }
});

const unblock = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const targetId = req.params.id;

  const friend = await Friends.findOne({
    $or: [
      {
        uid1: id,
        uid2: targetId,
      },
      {
        uid1: targetId,
        uid2: id,
      },
    ],
  });

  if (friend) {
    if (
      friend.status &&
      friend.status.type === 'oneWayBlock' &&
      friend.status.blockedId.toString() === targetId
    ) {
      await Friends.findByIdAndDelete(friend.id);
    }
  }

  return res.status(200).json({
    message: 'Unblock successfully',
  });
});

const friendList = asyncHandler(async (req, res, next) => {
  const user = req.user;

  const friends = await Friends.find({
    $or: [
      {
        uid1: user._id,
      },
      {
        uid2: user._id,
      },
    ],
  });

  const result = [];
  for (const friend of friends) {
    const friendId =
      friend.uid1.toString() === user._id.toString()
        ? friend.uid2
        : friend.uid1;
    const friendInfo = await Users.findById(friendId);
    if (friendInfo) result.push(friendInfo);
  }

  return res.status(200).json(result);
});

const unfriend = asyncHandler(async (req, res, next) => {
  const friendId = req.params.id;

  const friend = await Friends.findByIdAndUpdate(
    friendId,
    { 'status.type': 'disable' },
    { new: true }
  );

  if (friend) {
    console.log('Unfriend successfully');
  } else {
    console.log('Unfriend false');
  }

  return res.status(200).json({
    message: 'Unfriend successfully',
  });
});

const checkFriend = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  const friend = await Friends.findOne({ _id: id, 'status.type': 'available' });
  console.log(friend);

  if (friend) {
    return res.status(200).json({
      message: 'Check successfully',
    });
  } else {
    return res.status(500).json({
      message: 'Not found',
    });
  }
});
module.exports = {
  getFriendRequestList,
  friendReq,
  friendAccept,
  friendDecline,
  block,
  unblock,
  friendList,
  unfriend,
  checkFriend,
};
