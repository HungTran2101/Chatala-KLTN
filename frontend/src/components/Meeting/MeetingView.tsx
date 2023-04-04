import { useMeeting } from '@videosdk.live/react-sdk';
import { useEffect, useState } from 'react';
import Controls from './Controls';
import ParticipantView from './ParticipantView';

const MeetingView = (props) => {
  const [joined, setJoined] = useState(null);
  //Get the method which will be used to join the meeting.
  //We will also get the participants list to display all participants
  const { join, participants } = useMeeting({
    //callback for when meeting is joined successfully
    onMeetingJoined: () => {
      setJoined('JOINED');
    },
    //callback for when meeting is left
    onMeetingLeft: () => {
      props.onMeetingLeave();
    },
  });
  const joinMeeting = () => {
    setJoined('JOINING');
    join();
  };

  useEffect(() => {
    console.log(participants);
  }, [participants]);

  return (
    <div className='container'>
      <h3>Meeting Id: {props.meetingId}</h3>
      {joined && joined == 'JOINED' ? (
        <div>
          <Controls />
          {/* @ts-ignore */}
          {[...participants.keys()].map((participantId) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
            />
          ))}
        </div>
      ) : joined && joined == 'JOINING' ? (
        <p>Joining the meeting...</p>
      ) : (
        <button onClick={joinMeeting}>Join</button>
      )}
    </div>
  );
};

export default MeetingView;
