import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectFileState } from "../../../../features/redux/slices/fileSlice";
import { selectRoomInfoState } from "../../../../features/redux/slices/roomInfoSlice";
import { selectUserState } from "../../../../features/redux/slices/userSlice";
import { fileType, messageType } from "../../../../utils/types";
import { formatDate, getFileIcon } from "../../../Global/ProcessFunctions";
import * as S from "./ChatMsg.styled";
import ChatMsgOption from "./ChatMsgOption";

interface IChatMsg {
  data: messageType;
  position: string;
  setToggleImageZoom: (toggle: boolean) => void;
  setImageZoomList: (value: { index: number; list: fileType[] }) => void;
}

const ChatMsg = ({
  data,
  position,
  setToggleImageZoom,
  setImageZoomList,
}: IChatMsg) => {
  const [toggleOption, setToggleOption] = useState(false);
  const [images, setImages] = useState<fileType[]>([]);
  const [files, setFiles] = useState<fileType[]>([]);
  const roomFiles = useSelector(selectFileState);

  const roomInfo = useSelector(selectRoomInfoState);
  const user = useSelector(selectUserState);

  const getFileAndImageList = () => {
    const _images: fileType[] = [];
    const _files: fileType[] = [];
    data.fileIds.forEach((id) => {
      const file = roomFiles.list.find(
        (it) => it._id.toString() === id.toString()
      );
      if (file.type === "image") _images.push(file);
      else _files.push(file);
    });
    setImages(_images);
    setFiles(_files);
  };

  const imageZoomClick = (index: number) => {
    setImageZoomList({ index, list: images });
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
    getFileAndImageList();
  }, [data.fileIds]);

  return (
    <>
      {!data.deleted &&
        (data.senderId === user.info._id ? (
          <S.ChatMsgRight position={position}>
            <S.ChatMsgWrapper>
              {!data.unSend ? (
                <>
                  {files.length === 0 && images.length === 0 && (
                    <S.ChatMsgTextTail />
                  )}
                  {data.msg !== "" && <S.ChatMsgText>{data.msg}</S.ChatMsgText>}
                  {images.length > 0 && (
                    <S.ChatMsgFileImages imgNum={images?.length}>
                      {images?.map((image, index) => (
                        <S.ChatMsgFileImage
                          key={index}
                          imgNum={images?.length}
                          onClick={() => imageZoomClick(index)}
                        >
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
                  {files.length > 0 && (
                    <S.ChatMsgFiles>
                      {files.map(
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
                              <S.ChatMsgFileName>{file.name}</S.ChatMsgFileName>
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
              {!data.unSend && files.length === 0 && images.length === 0 && <S.ChatMsgTextTail />}
              {data.unSend ? (
                <S.ChatMsgUnSend>Message has been unsend</S.ChatMsgUnSend>
              ) : (
                <>
                  {data.msg !== "" && <S.ChatMsgText>{data.msg}</S.ChatMsgText>}
                  {images?.length > 0 && (
                    <S.ChatMsgFileImages imgNum={images?.length}>
                      {images?.map((image, index) => (
                        <S.ChatMsgFileImage
                          key={index}
                          imgNum={images?.length}
                          onClick={() => imageZoomClick(index)}
                        >
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
                  {files.length > 0 && (
                    <S.ChatMsgFiles>
                      {files.map(
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
                              <S.ChatMsgFileName>{file.name}</S.ChatMsgFileName>
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
