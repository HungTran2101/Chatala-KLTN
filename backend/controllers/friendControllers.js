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

const getNotiList = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const limit = !isNaN(req.params.limit) ? parseInt(req.params.limit) : 10;
  const pageNum = !isNaN(req.params.pageNum) ? parseInt(req.params.pageNum) : 1;

  let listNoti = [];

  const _listNoti = await Notifications.find({
    requestId: id,
    status: { $ne: 'Pending' },
  })
    .sort({ updatedAt: -1 })
    .skip(limit * pageNum - limit)
    .limit(limit);

  for (const noti of _listNoti) {
    if (noti.requestId.toString() === id.toString()) {
      let getUser = await Users.findById(noti.receiveId);
      listNoti.push({
        _id: noti._id,
        uid: noti.receiveId,
        name: getUser.name,
        avatar: getUser.avatar,
        status: noti.status,
        updatedAt: noti.updatedAt,
      });
    }
  }

  res.status(200).json(listNoti);
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
  if (!friend || friend.status.type === 'disable') {
    await Notifications.create({
      receiveId: receiveId,
      requestId: id,
    });
    return res.status(200).json({
      msg: 'Send friend request successfully',
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
  if (notification && notification.status == 'Pending') {
    await Notifications.findByIdAndUpdate(notificationId, {
      $set: {
        status: 'Accepted',
      },
    });

    await Users.findByIdAndUpdate(notification.requestId, {
      $inc: { unreadNoti: 1 },
    });

    if (inRelationship && inRelationship.status.type === 'disable') {
      //accept again
      const friendRelate = await Friends.findByIdAndUpdate(
        inRelationship._id,
        {
          $set: { 'status.type': 'available' },
        },
        { new: true }
      );
      return res.status(200).json({
        message: 'Accept successfully',
        friendRelateId: friendRelate._id,
      });
    } else {
      //first accept
      const friendRelate = await Friends.create({
        uid1: notification.requestId,
        uid2: notification.receiveId,
      });
      return res.status(200).json({
        message: 'Accept successfully',
        friendRelateId: friendRelate._id,
      });
    }
  } else {
    return next(new ErrorHandler('Unhandled error!', 500));
  }
});

const friendDecline = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const notification = await Notifications.findByIdAndUpdate(
    id,
    {
      $set: {
        status: 'Denied',
      },
    },
    { new: true }
  );

  await Users.findByIdAndUpdate(notification.requestId, {
    $inc: { unreadNoti: 1 },
  });

  return res.status(200).json({
    message: 'Decline successfully',
  });
});

const cancelRequest = asyncHandler(async (req, res, next) => {
  const notificationId = req.params.notificationId;

  await Notifications.findByIdAndRemove(notificationId);

  return res.status(200).json({
    message: 'Cancel request successfully',
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
  const limit = !isNaN(req.params.limit) ? parseInt(req.params.limit) : 20;
  const pageNum = !isNaN(req.params.pageNum) ? parseInt(req.params.pageNum) : 1;

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
    if (friendInfo)
      result.push({
        ...friendInfo.toObject(),
        type: friend.status.type,
        friendRelateId: friend._id,
      });
  }

  return res.status(200).json(result);
});

const friendListLimit = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const limit = !isNaN(req.params.limit) ? parseInt(req.params.limit) : 20;
  const pageNum = !isNaN(req.params.pageNum) ? parseInt(req.params.pageNum) : 1;

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
  let index = 0;
  for (const friend of friends) {
    if (index >= limit * pageNum - limit && index < limit * pageNum) {
      const friendId =
        friend.uid1.toString() === user._id.toString()
          ? friend.uid2
          : friend.uid1;
      const friendInfo = await Users.findById(friendId);
      if (friendInfo)
        result.push({
          ...friendInfo.toObject(),
          type: friend.status.type,
          friendRelateId: friend._id,
        });
    }
    index++;
  }

  return res.status(200).json(result);
});

const searchFriend = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const search = req.params.search;
  const limit = !isNaN(req.params.limit) ? parseInt(req.params.limit) : 20;
  const pageNum = !isNaN(req.params.pageNum) ? parseInt(req.params.pageNum) : 1;

  const searchFriends = await Users.find({
    $or: [
      {
        phone: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        name: {
          $regex: search,
          $options: 'i',
        },
      },
    ],
  }).limit(10);
  return res.status(200).json(searchFriends);
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
    return next(new ErrorHandler('Friend id is required', 400));
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
  getNotiList,
  friendReq,
  friendAccept,
  friendDecline,
  cancelRequest,
  block,
  unblock,
  friendList,
  unfriend,
  checkFriend,
  friendListLimit,
  searchFriend,
};
