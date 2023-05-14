import http from '../http';

import { API_URL } from './urls';

export const FriendApi = {
  friendRequestList: async function (): Promise<any> {
    return await http.get(API_URL.getFriendRequestList);
  },
  friendList: async function (): Promise<any> {
    return await http.get(API_URL.getFriendList);
  },
  friendRequest: async function (id: any): Promise<any> {
    return await http.post(`${API_URL.friendRequest}/${id}`);
  },
  friendAccept: async function (id: any): Promise<any> {
    return await http.post(`${API_URL.friendAccept}/${id}`);
  },
  friendDecline: async function (id: any): Promise<any> {
    return await http.post(`${API_URL.friendDecline}/${id}`);
  },
  block: async function (id: any): Promise<any> {
    return await http.post(`${API_URL.block}/${id}`);
  },
  unblock: async function (id: any): Promise<any> {
    return await http.post(`${API_URL.unblock}/${id}`);
  },
};
