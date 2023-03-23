import { messageSendType } from '../../utils/types';
import http from '../http';
import { API_URL } from './urls';

export const CLOUD_NAME = 'dzikgumce';
export const API_KEY = '883356262461341';

export const MessageApi = {
  send: async function (message: messageSendType): Promise<any> {
    return await http.post(API_URL.sendMessage, message);
  },
  unsend: async function (msgId: string): Promise<any> {
    return await http.put(`${API_URL.unsendMessage}/${msgId}/unsend`);
  },
  delete: async function (msgId: string): Promise<any> {
    return await http.delete(`${API_URL.unsendMessage}/${msgId}/delete`);
  },
  getSignedKey: async function (public_id?: string): Promise<any> {
    return await http.post(API_URL.getSignedKey, { public_id });
  },
  uploadFile: async function (formData: FormData): Promise<any> {
    return await http.post(
      `${API_URL.uploadFile}/${CLOUD_NAME}/auto/upload`,
      formData,
      {
        headers: { 'content-type': 'multipart/form-data' },
      }
    );
  },
};
