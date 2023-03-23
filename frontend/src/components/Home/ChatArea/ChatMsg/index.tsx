import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectRoomInfoState } from "../../../../features/redux/slices/roomInfoSlice";
import { selectUserState } from "../../../../features/redux/slices/userSlice";
import { messageType } from "../../../../utils/types";
import {
  formatDate,
  getFileIcon,
} from "../../../Global/ProcessFunctions";
import * as S from "./ChatMsg.styled";
import ChatMsgOption from "./ChatMsgOption";

interface IChatMsg {
  data: messageType;
  position: string;
  setToggleImageZoom: (toggle: boolean) => void;
  setImageZoomList: (
    value: Array<{ name: string; url: string; type: string }>
  ) => void;
}

const ChatMsg = ({
  data,
  position,
  setToggleImageZoom,
  setImageZoomList,
}: IChatMsg) => {
  const [toggleOption, setToggleOption] = useState(false);
  const [images, setImages] = useState<
    Array<{ name: string; url: string; type: string }>
  >([]);

  const roomInfo = useSelector(selectRoomInfoState);
  const user = useSelector(selectUserState);

  const getImageList = () => {
    const _images: Array<{ name: string; url: string; type: string }> = [];
    data.files.forEach((file) => {
      if (file.type === "image") _images.push(file);
    });
    setImages(_images);
  };

  const imageZoomClick = () => {
    setImageZoomList(images);
    setToggleImageZoom(true);
  };

  const getSenderAvatar = () => {
    if (roomInfo.info?.roomInfo.isGroup) {
      const sender = roomInfo.info.roomInfo.users.find(
        (user) => user.uid === data.senderId
      );
      return sender!.avatar;
    } else {
      return roomInfo.info!.roomAvatar;
    }
  };

  const getSenderName = () => {
    if (roomInfo.info?.roomInfo.isGroup) {
      const sender = roomInfo.info.roomInfo.users.find(
        (user) => user.uid === data.senderId
      );
      return sender!.nickname + " | " + formatDate(data.updatedAt, ".", true);
    }
    return formatDate(data.updatedAt, ".", true);
  };

  useEffect(() => {
    getImageList();
  }, [data]);

  return (
    <>
      {!data.deleted &&
        (data.senderId === user.info._id ? (
          <S.ChatMsgRight position={position}>
            <S.ChatMsgWrapper>
              {!data.unSend ? (
                <>
                  {data.files.length === 0 && <S.ChatMsgTextTail />}
                  {data.msg !== "" && <S.ChatMsgText>{data.msg}</S.ChatMsgText>}
                  {images?.length > 0 && (
                    <S.ChatMsgFileImages
                      imgNum={images?.length}
                      onClick={() => imageZoomClick()}
                    >
                      {images?.map((image, index) => (
                        <S.ChatMsgFileImage key={index} imgNum={images?.length}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image.url}
                            alt="image"
                            // layout='fill'
                            // objectFit='cover'
                            draggable={false}
                          />
                        </S.ChatMsgFileImage>
                      ))}
                    </S.ChatMsgFileImages>
                  )}
                  {data.files.length > 0 && (
                    <S.ChatMsgFiles>
                      {data.files.map(
                        (file, index) =>
                          file.type === "file" && (
                            <S.ChatMsgFile
                              key={index}
                              href={file.url}
                              target="_blank"
                              download
                            >
                              <S.ChatMsgFileIcon>
                                {getFileIcon(file)}
                              </S.ChatMsgFileIcon>
                              <S.ChatMsgFileName>
                                {file.name}
                              </S.ChatMsgFileName>
                            </S.ChatMsgFile>
                          )
                      )}
                    </S.ChatMsgFiles>
                  )}
                  <S.ChatMsgSenderName position={position}>
                    {getSenderName()}
                  </S.ChatMsgSenderName>
                </>
              ) : (
                <S.ChatMsgUnSend>Message has been unsend</S.ChatMsgUnSend>
              )}
            </S.ChatMsgWrapper>
            {!data.unSend && (
              <S.ChatMsgMoreIconWrapper>
                <S.ChatMsgMoreIcon onClick={() => setToggleOption(true)} />
                {toggleOption && (
                  <ChatMsgOption
                    msgId={data._id}
                    setToggleOption={setToggleOption}
                  />
                )}
              </S.ChatMsgMoreIconWrapper>
            )}
          </S.ChatMsgRight>
        ) : (
          <S.ChatMsgLeft position={position}>
            <S.ChatMsgAvatar position={position}>
              <Image
                src={getSenderAvatar()}
                alt="avatar"
                layout="fill"
                objectFit="cover"
              />
            </S.ChatMsgAvatar>
            <S.ChatMsgWrapper>
              {!data.unSend && data.files.length === 0 && <S.ChatMsgTextTail />}
              {data.unSend ? (
                <S.ChatMsgUnSend>Message has been unsend</S.ChatMsgUnSend>
              ) : (
                <>
                  {data.msg !== "" && <S.ChatMsgText>{data.msg}</S.ChatMsgText>}
                  {images?.length > 0 && (
                    <S.ChatMsgFileImages
                      imgNum={images?.length}
                      onClick={() => imageZoomClick()}
                    >
                      {images?.map((image, index) => (
                        <S.ChatMsgFileImage key={index} imgNum={images?.length}>
                          <img
                            src={image.url}
                            alt="image"
                            // layout='fill'
                            // objectFit='cover'
                            draggable={false}
                          />
                        </S.ChatMsgFileImage>
                      ))}
                    </S.ChatMsgFileImages>
                  )}
                  {data.files.length > 0 && (
                    <S.ChatMsgFiles>
                      {data.files.map(
                        (file, index) =>
                          file.type === "file" && (
                            <S.ChatMsgFile
                              key={index}
                              href={file.url}
                              target="_blank"
                              download
                            >
                              <S.ChatMsgFileIcon>
                                {getFileIcon(file)}
                              </S.ChatMsgFileIcon>
                              <S.ChatMsgFileName>
                                {file.name}
                              </S.ChatMsgFileName>
                            </S.ChatMsgFile>
                          )
                      )}
                    </S.ChatMsgFiles>
                  )}
                  <S.ChatMsgSenderName position={position}>
                    {getSenderName()}
                  </S.ChatMsgSenderName>
                </>
              )}
            </S.ChatMsgWrapper>
          </S.ChatMsgLeft>
        ))}
    </>
  );
};

export default ChatMsg;
