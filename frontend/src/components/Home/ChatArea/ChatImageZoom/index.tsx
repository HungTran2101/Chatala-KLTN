import Image from 'next/image';
import { useState } from 'react';
import * as S from './ChatImageZoom.styled';
import { fileType } from '../../../../utils/types';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/zoom';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import './styles.css';

// import required modules
import { Zoom, Navigation, Thumbs, FreeMode } from 'swiper';
import { AiOutlineClose } from 'react-icons/ai';

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
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    // <S.ChatImageZoom>
    //   <S.ModalOverlay
    //     onClick={() => setToggleImageZoom(false)}
    //   ></S.ModalOverlay>
    //   <S.ModalBody>
    //     {imageZoomList.length > 1 && (
    //       <S.NavigateLeft onClick={() => navigateImage(true)} />
    //     )}
    //     <S.ImageWrapper>
    //       <S.ImageCurrent>
    //         <Image
    //           src={imageZoomList[currentImageIndex].url}
    //           layout="fill"
    //           objectFit="contain"
    //           draggable="false"
    //         />
    //       </S.ImageCurrent>
    //       <S.ImageList>
    //         {imageZoomList.length > 1 &&
    //           imageZoomList.map((image, index) => (
    //             <S.ImageListItem
    //               key={index}
    //               active={index === currentImageIndex ? true : false}
    //               onClick={() => setCurrentImageIndex(index)}
    //             >
    //               <Image
    //                 src={image.url}
    //                 layout="fill"
    //                 objectFit="contain"
    //                 draggable="false"
    //               />
    //             </S.ImageListItem>
    //           ))}
    //       </S.ImageList>
    //     </S.ImageWrapper>
    //     {imageZoomList.length > 1 && (
    //       <S.NavigateRight onClick={() => navigateImage(false)} />
    //     )}
    //   </S.ModalBody>
    // </S.ChatImageZoom>
    <div
      style={{
        backgroundColor: 'rgb(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        position: 'fixed',
        zIndex: 9999999,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: '100vw',
        height: '100vh',
        padding: '30px 20px',
        paddingBottom: 0,
      }}
    >
      <Swiper
        loop
        navigation
        initialSlide={currentIndex}
        style={{
          //@ts-ignore
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
          height: '80%',
        }}
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className='mySwiper2'
      >
        <S.CloseButton onClick={() => setToggleImageZoom(false)}>
          <AiOutlineClose />
        </S.CloseButton>
        {imageZoomList.map((image, index) => (
          <SwiperSlide key={index}>
            <div className='swiper-zoom-container'>
              <img src={image.url} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={3}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className='mySwiper'
        style={{ height: '20%' }}
        breakpoints={{
          // when window width is <= 499px
          540: {
            slidesPerView: 5,
          },
          768: {
            slidesPerView: 7,
          },
          1024: {
            slidesPerView: 10,
          },
        }}
      >
        {imageZoomList.map((image, index) => (
          <SwiperSlide
            key={index}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <div
              className='swiper-zoom-container'
              style={{
                cursor: 'pointer',
                height: 'auto',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <img src={image.url} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ChatImageZoom;
