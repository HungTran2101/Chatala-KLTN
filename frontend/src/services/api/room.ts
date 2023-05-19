import http from '../http';
import { API_URL } from './urls';

export const RoomApi = {
  createRoom: async function ({
    users,
    friendRelateId = '',
    isGroup = false,
  }): Promise<any> {
    return await http.post(API_URL.createRoom, { isGroup, users, friendRelateId });
  },
  changeNickname: async function (
    roomId: string,
    uid: string,
    nickname: string
  ): Promise<any> {
    return await http.put(`${API_URL.changeNickname}/${roomId}/nickname`, {
      uid,
      nickname,
    });
  },
  getRoomList: async function (): Promise<any> {
    return await http.get(API_URL.getRoomList);
  },
  getRoomInfo: async function (roomId: string): Promise<any> {
    return await http.get(`${API_URL.getRoomInfo}/${roomId}`);
  },
  incUnreadMsg: async function (
    senderId: string,
    roomId: string
  ): Promise<any> {
    return await http.post(API_URL.incUnreadMsg, { senderId, roomId });
  },
  seenRoom: async function (uid: string, roomId: string): Promise<any> {
    return await http.post(API_URL.seenRoom, { uid, roomId });
  },
  changeGroupName: async function (
    roomId: string,
    groupName: string
  ): Promise<any> {
    return await http.put(`${API_URL.changeGroupName}/${roomId}/change-name`, {
      groupName,
    });
  },
};
