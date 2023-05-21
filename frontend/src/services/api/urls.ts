export const BASEURL =
  process.env.NEXT_PUBLIC_API_ENDPOINT ||
  // "https://chatala-backend.herokuapp.com"; // Staging
  'http://localhost:5000';

const API_BASE = `${BASEURL}/api`;

export const API_URL = {
  checkUser: `${API_BASE}/user/checkUser`,
  register: `${API_BASE}/user/register`,
  login: `${API_BASE}/user/login`,
  logout: `${API_BASE}/user/logout`,
  editUserInfo: `${API_BASE}/user/update`,
  editAvatar: `${API_BASE}/user/update/avatar`,
  resetPassword: `${API_BASE}/auth/password/reset`,
  getRoomList: `${API_BASE}/room`,
  getFriendList: `${API_BASE}/friend`,
  getRoomInfo: `${API_BASE}/room`,
  getLoggedUser: `${API_BASE}/user/getLoggedUser`,
  userFind: `${API_BASE}/user/find`,
  changePassword: `${API_BASE}/user/update/password`,
  getFriendRequestList: `${API_BASE}/friend/request`,
  friendRequest: `${API_BASE}/friend/request`,
  friendAccept: `${API_BASE}/friend/accept`,
  friendDecline: `${API_BASE}/friend/decline`,
  block: `${API_BASE}/friend/block`,
  unblock: `${API_BASE}/friend/unblock`,
  unfriend: `${API_BASE}/friend/unfriend`,
  checkFriend: `${API_BASE}/friend/check-friend`,
  sendMessage: `${API_BASE}/message`,
  saveFile: `${API_BASE}/message/savefile`,
  getFile: `${API_BASE}/message/getfile`,
  unsendMessage: `${API_BASE}/message`,
  deleteMessage: `${API_BASE}/message`,
  getSignedKey: `${API_BASE}/util/signedKey`,
  createRoom: `${API_BASE}/room`,
  changeNickname: `${API_BASE}/room`,
  uploadFile: `https://api.cloudinary.com/v1_1`,
  incUnreadMsg: `${API_BASE}/room/inc`,
  seenRoom: `${API_BASE}/room/seen`,
  getCallToken: `${API_BASE}/call/get-token`,
  createMeeting: `${API_BASE}/call/create-meeting`,
  validateMeeting: `${API_BASE}/call/validate-meeting`,
  changeGroupName: `${API_BASE}/room`,
  addMember: `${API_BASE}/room`,
  kickMember: `${API_BASE}/room`,
};
