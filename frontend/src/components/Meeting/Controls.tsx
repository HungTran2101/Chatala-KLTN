import { useMeeting } from '@videosdk.live/react-sdk';
import * as S from './Controls.styled';
import {
  BsFillMicFill,
  BsFillMicMuteFill,
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsFillCameraVideoOffFill,
} from 'react-icons/bs';
import { MdCallEnd } from 'react-icons/md';
import { useState } from 'react';
const Controls = () => {
  const { leave, toggleMic, toggleWebcam, } = useMeeting();

  const [controls, setControls] = useState({ cam: false, mic: false });
  return (
    <S.Container>
      <S.Button
        onClick={() => {
          setControls({ ...controls, mic: !controls.mic });
          toggleMic();
        }}
      >
        {controls.mic ? <BsFillMicFill /> : <BsFillMicMuteFill />}
      </S.Button>
      <S.Button onClick={() => leave()} redBg>
        <MdCallEnd />
      </S.Button>
      <S.Button
        onClick={() => {
          setControls({ ...controls, cam: !controls.cam });
          toggleWebcam();
        }}
      >
        {controls.cam ? <BsCameraVideoFill /> : <BsFillCameraVideoOffFill />}
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
