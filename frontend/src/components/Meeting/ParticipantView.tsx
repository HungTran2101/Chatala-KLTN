import { useParticipant } from '@videosdk.live/react-sdk';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import * as S from './ParticipantView.styled';
import { IoMicCircle, IoMicOffCircle } from 'react-icons/io5';
import {
  BsFillCameraVideoFill,
  BsFillCameraVideoOffFill,
  BsFillMicFill,
  BsFillMicMuteFill,
} from 'react-icons/bs';
import { MdScreenShare, MdStopScreenShare } from 'react-icons/md';

const ParticipantView = (props) => {
  const {
    webcamStream,
    micStream,
    webcamOn,
    micOn,
    isLocal,
    displayName,
    screenShareOn,
    screenShareStream,
    setQuality,
  } = useParticipant(props.participantId);

  const micRef = useRef(null);

  const [mic, setMic] = useState(false);
  const [cam, setCam] = useState(false);
  const [scr, setScr] = useState(false);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      setCam(true);
      return mediaStream;
    }
    // setQuality('high');
  }, [webcamStream, webcamOn]);

  const mediaStream = useMemo(() => {
    if (screenShareOn && screenShareStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(screenShareStream.track);
      setScr(true);
      return mediaStream;
    }
  }, [screenShareStream, screenShareOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error('videoElem.current.play() failed', error)
          );

        setMic(true);
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <>
      <S.Container>
        <S.Name>
          {displayName}
          <S.StatusWrap>
            {webcamOn ? (
              <S.Status>
                <BsFillCameraVideoFill />
              </S.Status>
            ) : (
              <S.Status red>
                <BsFillCameraVideoOffFill />
              </S.Status>
            )}
            {micOn ? (
              <S.Status>
                <BsFillMicFill />
              </S.Status>
            ) : (
              <S.Status red>
                <BsFillMicMuteFill />
              </S.Status>
            )}

            {screenShareOn ? (
              <S.Status>
                <MdScreenShare />
              </S.Status>
            ) : (
              <S.Status red>
                <MdStopScreenShare />
              </S.Status>
            )}
          </S.StatusWrap>
        </S.Name>
        <audio ref={micRef} autoPlay playsInline muted={isLocal} />
        <S.Video
          //
          playsinline // very very imp prop
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          url={videoStream}
          onError={(err) => {
            console.log(err, 'participant video error');
          }}
          height={'100%'}
          width={'100%'}
        />
      </S.Container>

      {/* <video width={"100%"} height={"100%"} ref={webcamRef} autoPlay /> */}
      {screenShareOn && screenShareStream && (
        <S.Container scr>
          <ReactPlayer
            //
            playsinline // very very imp prop
            playIcon={<></>}
            //
            pip={false}
            light={false}
            controls={false}
            muted={true}
            playing={true}
            //
            url={mediaStream} // passing mediastream here
            //
            height={'100%'}
            width={'100%'}
            onError={(err) => {
              console.log(err, 'presenter video error');
            }}
          />
        </S.Container>
      )}
    </>
  );
};

export default ParticipantView;
