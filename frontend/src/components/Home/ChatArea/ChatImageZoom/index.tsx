import Image from "next/image";
import { useState } from "react";
import * as S from "./ChatImageZoom.styled";
import { fileType } from "../../../../utils/types";

interface IChatImageZoom {
  setToggleImageZoom: (toggle: boolean) => void;
  imageZoomList: fileType[];
  currentIndex: number;
}

const ChatImageZoom = ({
  imageZoomList,
  setToggleImageZoom,
  currentIndex = 0,
}: IChatImageZoom) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);

  const navigateImage = (left: boolean) => {
    if (left) {
      if (currentImageIndex > 0) setCurrentImageIndex(currentImageIndex - 1);
    } else {
      if (currentImageIndex < imageZoomList.length - 1)
        setCurrentImageIndex(currentImageIndex + 1);
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
        <S.ImageWrapper>
          <S.ImageCurrent>
            <Image
              src={imageZoomList[currentImageIndex].url}
              layout="fill"
              objectFit="contain"
              draggable="false"
            />
          </S.ImageCurrent>
          <S.ImageList>
            {imageZoomList.length > 1 &&
              imageZoomList.map((image, index) => (
                <S.ImageListItem
                  key={index}
                  active={index === currentImageIndex ? true : false}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image.url}
                    layout="fill"
                    objectFit="contain"
                    draggable="false"
                  />
                </S.ImageListItem>
              ))}
          </S.ImageList>
        </S.ImageWrapper>
        {imageZoomList.length > 1 && (
          <S.NavigateRight onClick={() => navigateImage(false)} />
        )}
      </S.ModalBody>
    </S.ChatImageZoom>
  );
};

export default ChatImageZoom;
