const asyncHandler = require("express-async-handler");
const Users = require("../models/userModel");
const { generateJWT } = require("../utils/utilFunctions");
const ErrorHandler = require("../utils/errorHandler");
const Friends = require("../models/friendModel");
const Rooms = require("../models/roomModel");
const Notifications = require("../models/notificationModel");

const checkUser = asyncHandler(async (req, res, next) => {
  const phone = req.query.phone;

  const user = await Users.findOne({ phone: phone });

  if (!user) {
    res.status(200).json({
      message: "Valid phone number!",
    });
  } else {
    return next(new ErrorHandler("Phone number already exists!", 400));
  }
});

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, password, phone } = req.body;

  const regexPhone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  if (phone.match(regexPhone) && password.match(regexPassword)) {
    await Users.create({
      name: name.replace(/\s+/g, " ").trim(),
      phone,
      password,
    });

    res.status(200).json({
      message: "Register Successfully!",
    });
  } else {
    return next(new ErrorHandler("Register failed!", 404));
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;

  const user = await Users.findOne({ phone });

  if (user) {
    if (await user.matchPassword(password)) {
      res.cookie("token", generateJWT(user._id), {
        signed: true,
        httpOnly: true,
        secure: process.env.NODE_ENV === "DEVELOPMENT" ? false : true,
        sameSite: "none",
      });
      res.status(200).json({
        user,
        message: "Login successfully",
      });
    } else {
      return next(
        new ErrorHandler("Phone Number not found or Incorrect Password", 404)
      );
    }
  } else {
    return next(
      new ErrorHandler("Phone Number not found or Incorrect Password", 404)
    );
  }
});

const getLoggedUser = asyncHandler(async (req, res, next) => {
  res.status(200).json(req.user);
});

const logoutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successfully" });
});

const findUser = asyncHandler(async (req, res, next) => {
  const { search } = req.body;
  const id = req.user._id;

  const myFriends = await Friends.find({
    $or: [
      {
        uid1: id,
      },
      {
        uid2: id,
      },
    ],
  });
  let listRelatedId = [];
  myFriends.forEach((it) => {
    if (it.uid1.toString() === id.toString()) {
      listRelatedId.push({ id: it.uid2.toString(), status: it.status.type });
    } else {
      listRelatedId.push({ id: it.uid1.toString(), status: it.status.type });
    }
  });

  const pendingId = await Notifications.find({
    $or: [
      {
        receiveId: id,
      },
      {
        requestId: id,
      },
    ],
    status: "Pending",
  });

  pendingId.forEach((it) => {
    if (it.receiveId.toString() === id.toString()) {
      listRelatedId.push({
        id: it.requestId.toString(),
        status: "receive",
        notificationId: it.id,
      });
    } else {
      listRelatedId.push({
        id: it.receiveId.toString(),
        status: "request",
        notificationId: it.id,
      });
    }
  });

  const searchUsers = await Users.find({
    $or: [
      {
        phone: {
          $regex: search,
          $options: "i",
        },
      },
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
    ],
  }).limit(10);

  let result = [];
  let tempResult = {
    receive: [],
    request: [],
    available: [],
    undefined: [],
  };
  searchUsers.forEach((it) => {
    let status = undefined;
    let notificationId = undefined;
    listRelatedId.forEach((childIt) => {
      if (it.id === childIt.id) {
        status = childIt.status;
        notificationId = childIt.notificationId;
      }
    });
    if (it.id.toString() !== id.toString()) {
      tempResult[status].push({
        ...it.toObject(),
        status: status,
        notificationId: notificationId,
      });
    }
  });
  result = [
    ...tempResult.available,
    ...tempResult.receive,
    ...tempResult.request,
    ...tempResult.undefined,
  ];

  res.status(200).json({
    result,
  });
});

const editUserInfo = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const username = req.user.name;

  const { name, gender, dob } = req.body;

  const date = new Date();
  const userDob = new Date(dob);

  if (userDob < date) {
    const user = await Users.findByIdAndUpdate(
      id,
      { $set: { name, gender, dob } },
      {
        new: true,
      }
    );

    await Rooms.find({ "users.id": id, "users.nickname": username }).updateMany(
      { $set: { "users.$.nickname": name } }
    );

    res.status(200).json({
      user,
      message: "Update Info Successfully!",
    });
  } else {
    return next(new ErrorHandler("Please enter correct date of birth!", 404));
  }
});

const editAvatar = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;

  const user = await Users.findByIdAndUpdate(
    id,
    { $set: { avatar } },
    {
      new: true,
    }
  );

  await Rooms.findOneAndUpdate(
    { "users.uid": id },
    { $set: { "users.$.avatar": avatar } },
    {
      new: true,
    }
  );

  res.status(200).json({
    user,
    message: "Update Avatar Successfully!",
  });
});

const findUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await Users.findById(id);

  res.status(200).json(user);
});

const changePassword = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const { oldPassword, newPassword } = req.body;

  const user = await Users.findOne({ _id: id });

  if (user) {
    if (await user.matchPassword(oldPassword)) {
      const result = await Users.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            password: newPassword,
          },
        },
        { new: true }
      );
      console.log(result);
      res.status(200).json({
        message: "Update Password Successfully!",
      });
    } else {
      res.status(500).json({ error: "Wrong password enter" });
    }
  }
});

module.exports = {
  checkUser,
  registerUser,
  loginUser,
  findUser,
  getLoggedUser,
  logoutUser,
  editUserInfo,
  editAvatar,
  findUserById,
  changePassword,
};
