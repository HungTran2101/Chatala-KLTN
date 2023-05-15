export type userInfo = {
  _id: string;
  avatar: string;
  banner: string;
  name: string;
  phone: string;
  gender: string;
  dob: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type info = {
  name: string;
  gender: string;
  dob: string | Date;
  avatar: string;
};

export type updateUserInfo = {
  name: string;
  gender: string;
  dob: string | Date;
};

type MentionMsg = {
  uid: string;
  name: string;
};

export type messageSendType = {
  roomId: string;
  msg: string;
  replyId: string;
  fileIds: string[];
  mentions: MentionMsg[];
};

export type messageRawType = {
  roomId: string;
  msg: string;
  files: File[];
  replyId: string;
  mentions: MentionMsg[];
};

export type messageType = {
  roomId: string;
  senderId: string;
  msg: string;
  fileIds: string[];
  mentions: MentionMsg[];
  replyId: string;
  unSend: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  _id: string;
};

export type fileType = {
  name: string;
  url: string;
  type: string;
  roomId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  _id: string;
};

export type roomInfo = {
  roomName: string;
  roomAvatar: string;
  roomInfo: {
    createdAt: string;
    groupName: string;
    isGroup: boolean;
    lastMsg: string;
    updatedAt: string;
    users: roomUser[];
    __v: number;
    _id: string;
  };
};

export type roomUser = {
  avatar: string;
  nickname: string;
  role: boolean;
  uid: string;
  unReadMsg: number;
  _id: string;
};

export type FormValue = {
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
  phomeNumberCode: string;
};

export type UserRegister = {
  name: string;
  phone: string;
  password: string;
};

export type userLogin = {
  phone: string;
  password: string;
};

export type SearchResult = {
  _id: string;
  avatar: string;
  banner: string;
  name: string;
  phone: string;
  gender: string;
  dob: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  status: string;
  notificationId: string;
};

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}

export type Mention = {
  name: string;
  avatar: string;
  uid: string;
};

export type MentionList = Mention[];
