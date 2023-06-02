import http from '../http';

import { API_URL } from './urls';

export const FriendApi = {
  friendRequestList: async function (): Promise<any> {
    return await http.get(API_URL.getFriendRequestList);
  },
  friendList: async function (): Promise<any> {
    return await http.get(API_URL.getFriendList);
  },
  friendListLimit: async function (
    pageNum: number = 1,
    limit: number = 20
  ): Promise<any> {
    return await http.get(`${API_URL.getFriendListLimit}/${limit}/${pageNum}`);
  },
  search: async function (
    search: string,
    pageNum: number = 1,
    limit: number = 20
  ): Promise<any> {
    return await http.get(
      `${API_URL.searchFriend}/${search}/${limit}/${pageNum}`
    );
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
  // block: async function (id: any): Promise<any> {
  //   return await http.post(`${API_URL.block}/${id}`);
  // },
  // unblock: async function (id: any): Promise<any> {
  //   return await http.post(`${API_URL.unblock}/${id}`);
  // },
  unfriend: async function (id: any): Promise<any> {
    return await http.post(`${API_URL.unfriend}/${id}`);
  },
  checkFriend: async function (id: any): Promise<any> {
    return await http.post(API_URL.checkFriend, { id });
  },
};
