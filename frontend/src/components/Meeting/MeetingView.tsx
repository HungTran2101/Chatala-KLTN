import { useMeeting } from '@videosdk.live/react-sdk';
import { useEffect, useState } from 'react';
import Controls from './Controls';
import ParticipantView from './ParticipantView';
import * as S from './MeetingView.styled';

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
        <div>
          <S.ParticipantWrap>
            {/* @ts-ignore */}
            {[...participants.keys()].map((participantId) => (
              <ParticipantView
                participantId={participantId}
                key={participantId}
              />
            ))}
          </S.ParticipantWrap>
          <Controls />
        </div>
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
