import http from '../http';
import { UserRegister, userLogin, updateUserInfo } from '../../utils/types';

import { API_URL } from './urls';

export const UsersApi = {
  checkUser: async function (phone: string): Promise<any> {
    return await http.get(API_URL.checkUser, { params: { phone } });
  },
  register: async function (user: UserRegister): Promise<any> {
    return await http.post(API_URL.register, user);
  },
  resetPassword: async function (
    phone: string,
    password: string
  ): Promise<any> {
    return await http.post(API_URL.resetPassword, { phone, password });
  },
  login: async function (user: userLogin): Promise<any> {
    return await http.post(API_URL.login, user);
  },
  getLoggedUser: async function (): Promise<any> {
    return await http.get(API_URL.getLoggedUser);
  },
  logout: async function (): Promise<any> {
    return await http.get(API_URL.logout);
  },
  userFind: async function (search: any): Promise<any> {
    return await http.post(API_URL.userFind, search);
  },
  userFindById: async function (id: string): Promise<any> {
    return await http.get(`${API_URL.userFind}/${id}`);
  },
  editUserInfo: async function (user: updateUserInfo): Promise<any> {
    return await http.post(API_URL.editUserInfo, user);
  },
  editAvatar: async function (avatar: string): Promise<any> {
    return await http.post(API_URL.editAvatar, { avatar });
  },
  changePassword: async function (
    oldPassword: string,
    newPassword: string
  ): Promise<any> {
    return await http.post(API_URL.changePassword, {
      oldPassword: oldPassword,
      newPassword: newPassword,
    });
  },
  changeLocale: async function (locale: string = 'en'): Promise<any> {
    return await http.put(API_URL.changeLocale, { locale });
  },
  seenNoti: async function (): Promise<any> {
    return await http.get(API_URL.seenNoti);
  },
  //   list: async function (params?: any): Promise<any> {
  //     return await http.get(API_URL.login, { params: params })
  //   },
  //   detail: async function (username: string): Promise<any> {
  //     return await http.get(${API_URL.users}${username}/)
  //   },
  //   me: async function (): Promise<User> {
  //     return await http.get(${API_URL.users}me/)
  //   },
  //   update: async function (user: any): Promise<any> {
  //     return await http.patch(${API_URL.users}${user.username}/, user)
  //   },
  //   resetPassword: async function (
  //     username: string,
  //     data: UpdatePasswordUserParams
  //   ): Promise<any> {
  //     return await http.post(${API_URL.users}${username}/reset-password/, data)
  //   },
};
