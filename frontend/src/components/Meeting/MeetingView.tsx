import { useMeeting } from '@videosdk.live/react-sdk';
import { useEffect, useState } from 'react';
import Controls from './Controls';
import ParticipantView from './ParticipantView';
import * as S from './MeetingView.styled';
import GridLayout from 'react-grid-layout';

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
      // props.onMeetingLeave();
      window.close();
    },
  });
  const joinMeeting = () => {
    setJoined('JOINING');
    join();
  };

  useEffect(() => {
    joinMeeting();
  }, []);
  return (
    <S.Container>
      {/* <h3>Meeting Id: {props.meetingId}</h3> */}
      {joined && joined == 'JOINED' ? (
        <>
          {/* <S.ParticipantWrap> */}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6,1fr)',
              gridTemplateRows: 'repeat(5,1fr)',
              width: '100vw',
              height: '100vh',
              paddingBottom: '70px',
            }}
          >
            {/* @ts-ignore */}
            {[...participants.keys()].map((participantId) => (
              <ParticipantView
                participantId={participantId}
                key={participantId}
              />
            ))}
          </div>
          {/* </S.ParticipantWrap> */}
          <Controls />
        </>
      ) : joined && joined == 'JOINING' ? (
        <p>Joining the meeting...</p>
      ) : (
        // <button onClick={joinMeeting}>Join</button>
        <p>Loading...</p>
      )}
    </S.Container>
  );
};

export default MeetingView;
