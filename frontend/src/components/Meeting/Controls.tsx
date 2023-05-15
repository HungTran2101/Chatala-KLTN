import { useMeeting } from '@videosdk.live/react-sdk';
import * as S from './Controls.styled';
import {
  BsFillMicFill,
  BsFillMicMuteFill,
  BsCameraVideoFill,
  BsCameraVideoOffFill,
} from 'react-icons/bs';
import { MdCallEnd } from 'react-icons/md';
const Controls = () => {
  const { leave, toggleMic, toggleWebcam } = useMeeting();
  return (
    <S.Container>
      <S.Button onClick={() => toggleMic()}>
        <BsFillMicFill />
      </S.Button>
      <S.Button onClick={() => leave()} redBg>
        <MdCallEnd />
      </S.Button>
      <S.Button onClick={() => toggleWebcam()}>
        <BsCameraVideoFill />
      </S.Button>
      {/* <button style={{ backgroundColor: 'red' }}>Leave</button>
      <button onClick={() => toggleMic()} style={{ backgroundColor: 'green' }}>
        toggleMic
      </button>
      <button
        onClick={() => toggleWebcam()}
        style={{ backgroundColor: 'yellow' }}
      >
        toggleWebcam
      </button> */}
    </S.Container>
  );
};

export default Controls;
