// USER

const login = {
  url: "api/user/login",
  auth: false,
  method: "POST",
  req: {
    phone: String,
    password: String,
  },
  res: {
    avatar: String,
    banner: String,
    name: String,
  },
};

const register = {
  url: "api/user/register",
  auth: false,
  method: "POST",
  req: {
    name: String,
    phone: String,
    password: String,
  },
  res: {
    message: String,
  },
};

const findUser = {
  url: "api/user/find",
  auth: true,
  method: "POST",
  req: {
    nameOrPhone: String,
  },
  res: [
    {
      _id: String,
      avatar: String,
      banner: String,
      name: String,
      phone: String,
      gender: String,
      dob: String,
      isFriend: Boolean,
      createdAt: String,
      updatedAt: String,
    },
  ],
};

const findUserById = {
  url: "api/user/find/:id",
  auth: true,
  method: "GET",
  req: {},
  res: {
    _id: String,
    avatar: String,
    banner: String,
    name: String,
    phone: String,
    gender: String,
    dob: String,
    createdAt: String,
    updatedAt: String,
    __v: Number,
  },
};

const editUserInfo = {
  url: "api/user/update",
  auth: true,
  method: "POST",
  req: {
    avatar: String,
    name: String,
    gender: String,
    dob: Date,
  },
  res: {
    avatar: String,
    name: String,
    gender: String,
    dob: Date,
  },
};

const friendRequest = {
  url: "api/friend/request/:id",
  auth: true,
  method: "POST",
  req: {},
  res: {
    message: String,
  },
};

const friendAccept = {
  url: "api/friend/accept",
  auth: true,
  method: "POST",
  req: {},
  res: {
    message: String,
  },
};

const friendDecline = {
  url: "api/friend/decline",
  auth: true,
  method: "POST",
  req: {},
  res: {
    message: String,
  },
};

const block = {
  url: "api/friend/block/:id",
  auth: true,
  method: "POST",
  req: {},
  res: {
    message: String,
  },
};

const unblock = {
  url: "api/friend/unblock/:id",
  auth: true,
  method: "POST",
  req: {},
  res: {
    message: String,
  },
};

const setAvatar = {
  url: "api/user/avatar",
  auth: true,
  method: "POST",
  contentType: "multipart/form-data",
  req: {
    avatar: File,
  },
  res: {
    avatarUrl: String,
  },
};

const getFriendRequestList = {
  url: "api/friend/request",
  auth: true,
  method: "Get",
  req: {},
  res: [
    {
      _id: String,
      uid: String,
      avatar: String,
      banner: String,
      name: String,
      phone: String,
      gender: String,
      dob: String,
      createdAt: String,
      updatedAt: String,
    },
  ],
};

// ROOM

const createRoom = {
  url: "api/room",
  auth: true,
  method: "POST",
  req: {
    isGroup: Boolean,
    users: [
      {
        uid: String,
        nickname: String, //set nickname same as username
        avatar: String,
      },
    ],
  },
  res: {
    //room created
  },
};

const getRoomList = {
  url: "api/room",
  auth: true,
  method: "GET",
  req: {},
  res: [
    {
      _id: String,
      roomName: String,
      roomAvatar: String,
      lastMsg: String,
    },
  ],
};

const getRoomInfo = {
  url: "api/room/:id",
  auth: true,
  method: "GET",
  req: {},
  res: {
    roomName: String,
    roomAvatar: String,
    isGroup: Boolean,
    users: [
      {
        avatar: String,
        role: Boolean,
        name: String,
      },
    ],
    messages: [
      {
        _id: String,
        senderId: String,
        msg: String,
        files: [
          {
            url: String,
            type: String,
          },
        ],
        unSend: Boolean,
        delete: Boolean,
        createdAt: Date,
        modifiedAt: Date,
      },
    ],
  },
};

const changeRoomName = {
  url: "api/room/:roomId/change-name",
  auth: true,
  method: "PUT",
  req: {
    roomName: String,
  },
  res: {
    message: String,
  },
};

const setNickname = {
  url: "api/room/:roomId/nickname",
  auth: true,
  method: "PUT",
  req: {
    uid: String,
    nickname: String,
  },
  res: {
    message: String,
  },
};

const addMember = {
  url: "api/room/:roomId/member",
  auth: true,
  method: "POST",
  req: {
    uid: String,
  },
  res: {
    message: String,
  },
};

// MESSAGE

const sendMessage = {
  url: "api/message/",
  auth: true,
  method: "POST",
  req: {
    roomId: String,
    msg: String,
    files: [
      {
        url: String,
        name: String,
        type: String, //file or image
      },
    ],
  },
  res: {
    message: String,
  },
};

const unSendMessage = {
  url: "api/message/:msgId/unsend",
  auth: true,
  method: "PUT",
  req: {},
  res: {
    message: String,
  },
};

const deletedMessage = {
  url: "api/message/:msgId/delete",
  auth: true,
  method: "DELETE",
  req: {},
  res: {
    message: String,
  },
};

// UTILS

const signedFileUrl = {
  url: "api/util/signedFileUrl",
  auth: true,
  method: "GET",
  req: {},
  res: {
    signature: String,
    timestamps: String,
  },
};
