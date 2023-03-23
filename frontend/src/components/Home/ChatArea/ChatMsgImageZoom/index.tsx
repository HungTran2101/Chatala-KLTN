import Image from 'next/image';
import { useEffect, useState } from 'react';
import * as S from './ChatImageZoom.styled';

interface IChatImageZoom {
  setToggleImageZoom: (toggle: boolean) => void;
  imageZoomList: Array<{ name: string; url: string; type: string }>;
}

const ChatImageZoom = ({
  imageZoomList,
  setToggleImageZoom,
}: IChatImageZoom) => {
  const [currentImage, setCurrentImage] = useState(0);

  const navigateImage = (left: boolean) => {
    if (left) {
      if (currentImage > 0) setCurrentImage(currentImage - 1);
    } else {
      if (currentImage < imageZoomList.length - 1)
        setCurrentImage(currentImage + 1);
    }
  };

  return (
    <S.ChatImageZoom>
      <S.ModalOverlay
        onClick={() => setToggleImageZoom(false)}
      ></S.ModalOverlay>
      <S.ModalBody>
        {imageZoomList.length > 1 && (
          <S.NavigateLeft onClick={() => navigateImage(true)} />
        )}
        <Image
          src={imageZoomList[currentImage].url}
          layout='fill'
          objectFit='contain'
          draggable='false'
        />
        {imageZoomList.length > 1 && (
          <S.NavigateRight onClick={() => navigateImage(false)} />
        )}
      </S.ModalBody>
    </S.ChatImageZoom>
  );
};

export default ChatImageZoom;
