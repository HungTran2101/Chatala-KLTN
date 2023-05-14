import http from '../http';
import { API_URL } from './urls';

// API call to generate authentication token

export const CallApi = {
  getToken: async () => {
    const res = await fetch(API_URL.getCallToken, {
      method: 'GET',
    });

    const { token } = await res.json();
    return token;
  },

  // API call to create meeting
  createMeeting: async ({ token }) => {
    const res = await fetch(API_URL.createMeeting, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    const { meetingId } = await res.json();
    return meetingId;
  },
  validateMeeting: async function (
    meetingId: string,
    token: string
  ): Promise<any> {
    return await http.post(
      `${API_URL.validateMeeting}/${meetingId}`,
      JSON.stringify({ token })
    );
  },
  // createMeeting: async function ({ token }): Promise<any> {
  //   return await http.post(API_URL.getCallToken, JSON.stringify({ token }));
  // },
};
