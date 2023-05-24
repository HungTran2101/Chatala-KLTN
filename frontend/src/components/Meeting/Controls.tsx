import { useMeeting } from '@videosdk.live/react-sdk';
import * as S from './Controls.styled';
import {
  BsFillMicFill,
  BsFillMicMuteFill,
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsFillCameraVideoOffFill,
} from 'react-icons/bs';
import { MdCallEnd, MdScreenShare } from 'react-icons/md';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { utilActions } from '../../features/redux/slices/utilSlice';
const Controls = () => {
  const { leave, toggleMic, toggleWebcam, toggleScreenShare } = useMeeting();

  const handleToggleScreenShare = () => {
    // Toggling screen share
    toggleScreenShare();
  };
  const dispatch = useDispatch();

  return (
    <S.Container>
      <S.Button
        onClick={() => {
          toggleMic();
        }}
      >
        <BsFillMicFill />
      </S.Button>
      <S.Button
        onClick={() => {
          toggleWebcam();
        }}
      >
        <BsCameraVideoFill />
      </S.Button>
      <S.Button onClick={handleToggleScreenShare}>
        <MdScreenShare />
      </S.Button>
      <S.Button onClick={() => leave()} redBg>
        <MdCallEnd />
      </S.Button>
    </S.Container>
  );
};

export default Controls;
