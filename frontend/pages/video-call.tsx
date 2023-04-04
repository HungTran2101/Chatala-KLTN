import React, { useEffect, useRef, useState } from 'react';
import { MeetingConsumer } from '@videosdk.live/react-sdk';
import { CallApi } from '../src/services/api/call';
import JoinScreen from '../src/components/Meeting/JoinScreen';

import dynamic from 'next/dynamic';

const MeetingProvider = dynamic(
  () => import('../src/components/Meeting/MeetingProvider'),
  {
    ssr: false,
  }
);

const MeetingView = dynamic(
  () => import('../src/components/Meeting/MeetingView'),
  {
    ssr: false,
  }
);

function VideoCall() {
  const [token, setToken] = useState(null);
  const [meetingId, setMeetingId] = useState(null);
  const [isValid, setIsValid] = useState(false);

  // const getMeetingAndToken = async () => {
  //   const token = await CallApi.getToken();
  //   const meetingId = await CallApi.createMeeting({ token });

  //   console.log('token', token);
  //   console.log('meetingId', meetingId);

  //   setToken(token);
  //   setMeetingId(meetingId);
  // };
  const joinMeeting = async () => {
    const res = await CallApi.validateMeeting(meetingId, token);
    if (res) setIsValid(true);
    console.log(res);
  };

  const createMeeting = async () => {
    const meetingId = await CallApi.createMeeting({ token });
    console.log('meetingId', meetingId);
    setMeetingId(meetingId);
    setIsValid(true);
  };

  const getToken = async () => {
    const token = await CallApi.getToken();
    console.log('token', token);
    setToken(token);
  };

  useEffect(() => {
    getToken();
    console.log(meetingId);
  }, []);

  return token && meetingId && isValid ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: 'Participant Name',
      }}
      token={token}
      // joinWithoutUserInteraction // Boolean
    >
      <MeetingView meetingId={meetingId} />
    </MeetingProvider>
  ) : (
    <JoinScreen
      setMeetingId={setMeetingId}
      // getMeetingAndToken={getMeetingAndToken}
      createMeeting={createMeeting}
      joinMeeting={joinMeeting}
    />
  );
}

export default VideoCall;
