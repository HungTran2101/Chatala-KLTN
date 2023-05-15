interface JoinScreenProps {
  setMeetingId: (val: string) => void;
  getMeetingAndToken?: () => void;
  createMeeting: () => void;
  joinMeeting: () => void;
}

const JoinScreen = ({
  setMeetingId,
  getMeetingAndToken,
  joinMeeting,
  createMeeting,
}: JoinScreenProps) => {
  return (
    <div>
      <input
        type='text'
        placeholder='Enter Meeting Id'
        onChange={(e) => {
          setMeetingId(e.target.value);
        }}
      />
      <button onClick={joinMeeting} style={{ backgroundColor: 'green' }}>
        Join
      </button>
      <button onClick={createMeeting} style={{ backgroundColor: 'blue' }}>
        Create
      </button>
    </div>
  );
};

export default JoinScreen;
