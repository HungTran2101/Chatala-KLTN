import React, { useEffect, useRef, useState } from 'react';
import { CallApi } from '../src/services/api/call';
// import JoinScreen from '../src/components/Meeting/JoinScreen';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSocketContext } from '../src/contexts/socket';
// import { Constants } from '@videosdk.live/react-sdk';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const MeetingProvider = dynamic(
  () => import('../src/components/Meeting/MeetingProvider'),
  {
    ssr: false,
  }
);

const MeetingAppProvider = dynamic(
  () => import('../src/components/Meeting/MeetingAppContextDef'),
  {
    ssr: false,
  }
);

const MeetingContainer = dynamic(
  () => import('../src/components/Meeting/meeting/MeetingContainer'),
  {
    ssr: false,
  }
);

function VideoCall() {
  const router = useRouter();

  // const [token, setToken] = useState(null);
  // const [meetingId, setMeetingId] = useState(null);
  // const [name, setName] = useState('Default name');
  // const [isValid, setIsValid] = useState(false);

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

  // const [token, setToken] = useState("");
  // const [meetingId, setMeetingId] = useState("");
  const [participantName, setParticipantName] = useState('');
  const [micOn, setMicOn] = useState(false);
  const [webcamOn, setWebcamOn] = useState(false);
  const [selectedMic, setSelectedMic] = useState({ id: null });
  const [selectedWebcam, setSelectedWebcam] = useState({ id: null });
  const [selectWebcamDeviceId, setSelectWebcamDeviceId] = useState(
    selectedWebcam.id
  );
  // const [meetingMode, setMeetingMode] = useState(Constants.modes.CONFERENCE);
  const [selectMicDeviceId, setSelectMicDeviceId] = useState(selectedMic.id);
  const [isMeetingStarted, setMeetingStarted] = useState(false);
  const [isMeetingLeft, setIsMeetingLeft] = useState(false);

  const isMobile = window.matchMedia(
    'only screen and (max-width: 768px)'
  ).matches;

  useEffect(() => {
    if (isMobile) {
      window.onbeforeunload = () => {
        return 'Are you sure you want to exit?';
      };
    }
  }, [isMobile]);

  return router.query.meetingId && router.query.token ? (
    // <MeetingProvider
    //   config={{
    //     meetingId: router.query.meetingId,
    //     micEnabled: false,
    //     webcamEnabled: false,
    //     name: router.query.name,
    //   }}
    //   token={router.query.token}
    //   // joinWithoutUserInteraction // Boolean
    // >
    //   <MeetingView meetingId={router.query.meetingId} />
    // </MeetingProvider>
    <>
      <ToastContainer
        toastClassName={() =>
          'relative flex py-4 px-3 rounded overflow-hidden cursor-pointer bg-white shadow-lg'
        }
        bodyClassName={() => 'text-black text-base font-normal'}
        position='bottom-left'
        autoClose={4000}
        hideProgressBar={true}
        newestOnTop={false}
        closeButton={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
      <MeetingAppProvider
        //@ts-ignore
        selectedMic={selectedMic}
        selectedWebcam={selectedWebcam}
        initialMicOn={micOn}
        initialWebcamOn={webcamOn}
      >
        <MeetingProvider
          config={{
            meetingId: router.query.meetingId,
            micEnabled: micOn,
            webcamEnabled: webcamOn,
            name: router.query.name ? router.query.name : 'TestUser',
            mode: 'CONFERENCE',
            multiStream: true,
          }}
          token={router.query.token}
          reinitialiseMeetingOnConfigChange={true}
          joinWithoutUserInteraction={true}
        >
          <MeetingContainer
            onMeetingLeave={() => {
              // setToken('');
              // setMeetingId('');
              // setParticipantName('');
              setWebcamOn(false);
              setMicOn(false);
              setMeetingStarted(false);
              window.close()
            }}
            setIsMeetingLeft={setIsMeetingLeft}
            selectedMic={selectedMic}
            selectedWebcam={selectedWebcam}
            selectWebcamDeviceId={selectWebcamDeviceId}
            setSelectWebcamDeviceId={setSelectWebcamDeviceId}
            selectMicDeviceId={selectMicDeviceId}
            setSelectMicDeviceId={setSelectMicDeviceId}
            micEnabled={micOn}
            webcamEnabled={webcamOn}
          />
        </MeetingProvider>
      </MeetingAppProvider>
    </>
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
