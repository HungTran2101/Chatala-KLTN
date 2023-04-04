import { useMeeting } from '@videosdk.live/react-sdk';
import { useState } from 'react';
import ParticipantView from './ParticipantView';

// Helper function for participant loop.
const chunk = (arr) => {
  const newArr = [];
  while (arr.length) newArr.push(arr.splice(0, 3));
  return newArr;
};

const MeetingGrid = ({ meetingId }) => {
  const [joined, setJoined] = useState(false);
  const { join, leave, toggleMic, toggleWebcam, toggleScreenShare } =
    useMeeting();

  const { participants } = useMeeting();
  const joinMeeting = () => {
    setJoined(true);
    join();
  };
  return (
    <div>
      <header>Meeting Id: {meetingId}</header>
      {joined ? (
        <div>
          <button onClick={() => leave()} style={{ backgroundColor: 'green' }}>
            Leave
          </button>
          <button
            onClick={() => toggleMic()}
            style={{ backgroundColor: 'blue' }}
          >
            toggleMic
          </button>
          <button
            onClick={() => toggleWebcam()}
            style={{ backgroundColor: 'red' }}
          >
            toggleWebcam
          </button>
          <button
            onClick={() => toggleScreenShare()}
            style={{ backgroundColor: 'yellow' }}
          >
            toggleScreenShare
          </button>
        </div>
      ) : (
        <button onClick={joinMeeting}>Join</button>
      )}
      <div className='wrapper'>
        {/* @ts-ignore */}
        {chunk([...participants.keys()]).map((k) => (
          <div className='box' key={k} style={{ display: 'flex' }}>
            {k.map((l) => (
              <ParticipantView key={l} participantId={l} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingGrid;
