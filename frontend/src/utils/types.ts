import type { StaticImageData } from 'next/image';

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
  locale: string;
  __v: number;
};

export type friendInfo = {
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
  type: string;
  locale: string;
  friendRelateId: string;
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
    friendRelateId: string;
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
  isLeave: boolean;
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
  locale: string;
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

export type UITextType = {
  locale: string;
  webTitle: string;
  welcome: {
    welcomeLabel: string;
    description: string;
  };
  messageNoti: {
    resetPasswordSuccess: string;
    unfriendSuccess: string;
    addToGroupSuccess: string;
    kickFromGroupSuccess: string;
    changeGroupNameSuccess: string;
    changeNicknameSuccess: string;
    createGroupSuccess: string;
    requestFriendSuccess: string;
    acceptFriendSuccess: string;
    declineFriendSuccess: string;
    editAvatarSuccess: string;
    editInfoSuccess: string;
    registrationSuccess: string;
    kickFromWarning: string;
  };
  topBar: {
    info: {
      phoneLable: string;
      fullnameLabel: string;
      genderLabel: string;
      dobLabel: string;
      update: {
        genderLabel: string;
        maleLabel: string;
        femaleLabel: string;
        updateConfirm: string;
        updateCancel: string;
        cropZoom: string;
        cropRotate: string;
        cropConfirm: string;
        cropCancel: string;
      };
    };
    search: {
      placeHolder: string;
      modal: {
        loading: string;
        message: string;
        accept: string;
        decline: string;
        pending: string;
        addfriend: string;
      };
    };
    noti: {
      title: string;
      empty: string;
      accept: string;
      decline: string;
    };
    setting: {
      general: {
        title: string;
        language: {
          label: string;
          options: StaticImageData[];
        };
      };
      security: {
        title: string;
        password: {
          title: string;
          oldpass: string;
          newpass: string;
          confirmpass: string;
          update: string;
        };
      };
    };
  };
  sideBar: {
    topNav: {
      createGroup: {
        title: string;
        searchPlaceholder: string;
        addbutton: string;
        confirm: string;
        cancel: string;
      };
      friendList: {
        title: string;
        searchPlaceholder: string;
      };
    };
  };
  chatArea: {
    online: string;
    offline: string;
    callLabel: string;
    receiveCallLabel: string;
    callCancel: string;
    callAccept: string;
    callDecline: string;
    chatAreaMain: {
      inputPlaceholder: string;
      inputReplyTo: string;
      yourself: string;
      replyToYourself: string;
      replyToOther: string;
      replyToMe: string;
      replyToThemselves: string;
      replyTo: string;
      reply: string;
      unsend: string;
      unsended: string;
      delete: string;
      unsendConfirm: string;
      deleteConfirm: string;
      descriptionConfirm: string;
      cancelConfirm: string;
    };
    moreOptions: {
      profile: string;
      nickname: {
        label: string;
        title: string;
        cancel: string;
      };
      groupname: {
        label: string;
        cancel: string;
      };
      unfriend: {
        label: string;
        titleConfirm: string;
        descriptionConfirm: string;
        cancelConfirm: string;
      };
      groupMembers: {
        label: string;
        searchPlaceholder: string;
        nickname: string;
        kick: string;
        titleConfirm: string;
        descriptionConfirm: string;
        cancelConfirm: string;
      };
      addMembers: {
        label: string;
        searchPlaceholder: string;
        add: string;
        titleConfirm: string;
        descriptionConfirm: string;
        cancelConfirm: string;
      };
      photos: string;
      files: string;
    };
  };
};
