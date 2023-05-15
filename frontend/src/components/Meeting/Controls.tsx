import { useMeeting } from '@videosdk.live/react-sdk';

const Controls = () => {
  const { leave, toggleMic, toggleWebcam } = useMeeting();
  return (
    <div>
      <button onClick={() => leave()} style={{ backgroundColor: 'red' }}>
        Leave
      </button>
      <button onClick={() => toggleMic()} style={{ backgroundColor: 'green' }}>
        toggleMic
      </button>
      <button
        onClick={() => toggleWebcam()}
        style={{ backgroundColor: 'yellow' }}
      >
        toggleWebcam
      </button>
    </div>
  );
};

export default Controls;
