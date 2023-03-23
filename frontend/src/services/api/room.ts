import http from "../http";
import { API_URL } from "./urls";

export const RoomApi = {
  createRoom: async function (users: any, isGroup: boolean = false): Promise<any> {
    return await http.post(API_URL.createRoom, { isGroup, users });
  },
  changeNickname: async function (roomId: string, uid: string, nickname: string): Promise<any> {
    return await http.put(`${API_URL.changeNickname}/${roomId}/nickname`, {uid, nickname})
  },
  getRoomList: async function (): Promise<any> {
    return await http.get(API_URL.getRoomList);
  },
  getRoomInfo: async function (roomId: string): Promise<any> {
    return await http.get(`${API_URL.getRoomInfo}/${roomId}`);
  },
};
