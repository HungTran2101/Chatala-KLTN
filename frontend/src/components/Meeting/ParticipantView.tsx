import { useParticipant } from '@videosdk.live/react-sdk';
import { useEffect, useMemo, useRef } from 'react';
import ReactPlayer from 'react-player';
import * as S from './ParticipantView.styled';

const ParticipantView = (props) => {
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(props.participantId);

  const micRef = useRef(null);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

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
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <S.Container>
      <S.Name>
        {displayName} | Webcam: {webcamOn ? 'ON' : 'OFF'} | Mic:{' '}
        {micOn ? 'ON' : 'OFF'}
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
        height={(400 * 9) / 16}
        width={400}
      />
    </S.Container>
  );
};

export default ParticipantView;
