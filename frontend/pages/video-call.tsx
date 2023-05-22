import React, { useEffect, useRef, useState } from 'react';
import { CallApi } from '../src/services/api/call';
import JoinScreen from '../src/components/Meeting/JoinScreen';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSocketContext } from '../src/contexts/socket';

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
  const router = useRouter();

  const [token, setToken] = useState(null);
  const [meetingId, setMeetingId] = useState(null);
  const [name, setName] = useState('Default name');
  const [isValid, setIsValid] = useState(false);

  const socket = useSocketContext();

  // const joinMeeting = async () => {
  //   console.log('join', meetingId);
  //   const res = await CallApi.validateMeeting(meetingId, token);
  //   if (res) setIsValid(true);
  // };

  // const createMeeting = async () => {
  //   const meetingId = await CallApi.createMeeting(token);
  //   setMeetingId(meetingId);
  //   setIsValid(true);
  //   return meetingId;
  // };

  // const getToken = async () => {
  //   const callToken = await CallApi.getToken();
  //   console.log('token', token);
  //   setToken(callToken);
  //   return callToken;
  // };

  // useEffect(() => {
  //   getToken();
  //   const validate = async () => {
  //     if (token) {
  //       if (!meetingId) {
  //         const _meetingId = await createMeeting();
  //         socket.emit('calling', {
  //           meetingId: _meetingId,
  //           callerId: router.query.callerId,
  //           receiverIds: router.query.receiverIds,
  //         });
  //       } else joinMeeting();
  //     }
  //   };
  //   validate();
  // }, [token]);

  useEffect(() => {
    // if (router.query.meetingId) {
    //   setMeetingId(router.query.meetingId as string);
    // }
    // if (router.query.name) {
    //   setName(router.query.name as string);
    // }
    // if (router.query.token) {
    //   setName(router.query.token as string);
    // }
    console.log(router.query);
  }, [router.query]);

  return (router.query.meetingId && router.query.token) ? (
    <MeetingProvider
      config={{
        meetingId: router.query.meetingId,
        micEnabled: false,
        webcamEnabled: false,
        name: router.query.name,
      }}
      token={router.query.token}
      // joinWithoutUserInteraction // Boolean
    >
      <MeetingView meetingId={router.query.meetingId} />
    </MeetingProvider>
  ) : (
    // <JoinScreen
    //   setMeetingId={setMeetingId}
    //   // getMeetingAndToken={getMeetingAndToken}
    //   createMeeting={createMeeting}
    //   joinMeeting={joinMeeting}
    // />
    <div>Loading...</div>
  );
}

export default VideoCall;
