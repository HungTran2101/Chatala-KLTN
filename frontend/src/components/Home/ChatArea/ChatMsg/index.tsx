import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectFileState } from '../../../../features/redux/slices/fileSlice';
import { selectRoomInfoState } from '../../../../features/redux/slices/roomInfoSlice';
import { selectUserState } from '../../../../features/redux/slices/userSlice';
import { fileType, messageType } from '../../../../utils/types';
import {
  formatDate,
  getFileIcon,
  getReplyInfo,
} from '../../../Global/ProcessFunctions';
import * as S from './ChatMsg.styled';
import ChatMsgOption from './ChatMsgOption';
import { selectMessageState } from '../../../../features/redux/slices/messageSlice';
import { MdOutlineReply } from 'react-icons/md';

interface IChatMsg {
  data: messageType;
  position: string;
  isLastMsg: boolean;
  isUnfriend: boolean;
  setToggleImageZoom: (toggle: boolean) => void;
  setImageId: (value: string) => void;
}

const ChatMsg = ({
  data,
  position,
  isLastMsg,
  isUnfriend,
  setToggleImageZoom,
  setImageId,
}: IChatMsg) => {
  const [toggleOption, setToggleOption] = useState(false);
  const [toggleTooltip, setToggleTooltip] = useState(false);
  const [images, setImages] = useState<fileType[]>([]);
  const [files, setFiles] = useState<fileType[]>([]);

  const messages = useSelector(selectMessageState);
  const roomfiles = useSelector(selectFileState);
  const roomInfo = useSelector(selectRoomInfoState);
  const user = useSelector(selectUserState);

  //Reply
  const replyMsg = getReplyInfo(
    messages.list,
    data.replyId,
    roomfiles.list
  ).replyMsg;
  const handleReplyClick = () => {
    document
      .getElementById(data.replyId)
      .scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const setReplyLabel = () => {
    const message = messages.list.find((it) => it._id === data.replyId);
    if (message) {
      const replyTarget = roomInfo.info.roomInfo.users.find(
        (it) => it.uid === message.senderId
      );
      const replyUser = roomInfo.info.roomInfo.users.find(
        (it) => it.uid === data.senderId
      );
      if (data.senderId === user.info._id) {
        //message on the right
        if (replyTarget.uid === data.senderId)
          return `You replying to yourself`;
        else return `You replying to ${replyTarget.nickname}`;
      } else {
        //message on the left
        if (replyTarget.uid === user.info._id)
          return `${replyUser.nickname} replying to you`;
        else if (replyTarget.uid === data.senderId)
          return `${replyUser.nickname} replying to themselves`;
        else return `${replyUser.nickname} replying to ${replyTarget.nickname}`;
      }
    } else return '';
  };
  const replyLabel = setReplyLabel();

  const getFileAndImageList = () => {
    const _images: fileType[] = [];
    const _files: fileType[] = [];
    data.fileIds.forEach((id) => {
      const file = roomfiles.list.find(
        (it) => it._id.toString() === id.toString()
      );
      if (file) {
        if (file.type === 'image') _images.push(file);
        else _files.push(file);
      }
    });
    setImages(_images);
    setFiles(_files);
  };

  useEffect(() => {
    getFileAndImageList();
  }, [data.fileIds]);

  const imageZoomClick = (imgId: string) => {
    setImageId(imgId);
    setToggleImageZoom(true);
  };

  const getSenderAvatar = () => {
    if (roomInfo.info?.roomInfo.isGroup) {
      const sender = roomInfo.info.roomInfo.users.find(
        (user) => user.uid === data.senderId
      );
      return sender ? sender.avatar : '';
    } else {
      return roomInfo.info!.roomAvatar;
    }
  };

  const getSenderName = () => {
    if (roomInfo.info?.roomInfo.isGroup) {
      const sender = roomInfo.info.roomInfo.users.find(
        (user) => user.uid === data.senderId
      );
      return sender
        ? sender!.nickname + ' | ' + formatDate(data.updatedAt, '.', true)
        : '';
    }
    return formatDate(data.updatedAt, '.', true);
  };

  const boldString = (str: string, substr: string) => {
    str = str.replace(RegExp(substr, 'g'), `<b>${substr}</b>`);
    return str;
  };

  const preProcessMsg = () => {
    let msg = data.msg;
    if (data.mentions.length > 0) {
      data.mentions.map((it) => {
        msg = boldString(msg, it.name);
      });
    }
    return msg;
  };

  const tooltip = useRef<number>();
  const onHoverMsg = (show: boolean) => {
    if (show) {
      tooltip.current = window.setTimeout(() => {
        setToggleTooltip(true);
      }, 500);
    } else {
      window.clearTimeout(tooltip.current);
      if (toggleTooltip) {
        setToggleTooltip(false);
      }
    }
  };

  return (
    <>
      {!data.deleted &&
        (data.senderId === user.info._id ? (
          <S.ChatMsgRight id={data._id} position={position}>
            <S.ChatMsgWrapper
              onMouseEnter={() => onHoverMsg(true)}
              onMouseLeave={() => onHoverMsg(false)}
            >
              {toggleTooltip && (
                <S.ChatTooltip>{getSenderName()}</S.ChatTooltip>
              )}
              {!data.unSend ? (
                <>
                  {files.length === 0 && images.length === 0 && (
                    <S.ChatMsgTextTail />
                  )}
                  {data.replyId && (
                    <S.ChatMsgReply onClick={handleReplyClick}>
                      <S.ChatReplyLabel>
                        {replyLabel}
                        <MdOutlineReply />
                      </S.ChatReplyLabel>
                      {replyMsg &&
                        (replyMsg.type === 'image' ? (
                          <S.ChatMsgReplyImage>
                            <img src={replyMsg.msg} alt="reply img" />
                          </S.ChatMsgReplyImage>
                        ) : (
                          <S.ChatMsgReplyText>
                            {replyMsg.type === 'file' && (
                              <S.ChatMsgReplyFileIcon>
                                {getFileIcon({ name: replyMsg.msg })}
                              </S.ChatMsgReplyFileIcon>
                            )}
                            {replyMsg.msg}
                          </S.ChatMsgReplyText>
                        ))}
                    </S.ChatMsgReply>
                  )}
                  {data.msg !== '' && (
                    <S.ChatMsgText
                      dangerouslySetInnerHTML={{ __html: preProcessMsg() }}
                    ></S.ChatMsgText>
                  )}
                  {images.length > 0 && (
                    <S.ChatMsgFileImages imgNum={images?.length}>
                      {images?.map((image, index) => (
                        <S.ChatMsgFileImage
                          key={index}
                          imgNum={images?.length}
                          onClick={() => imageZoomClick(image._id)}
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
                          file.type === 'file' && (
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
            {!data.unSend && !isUnfriend && (
              <S.ChatMsgMoreIconWrapper>
                <S.ChatMsgMoreIcon onClick={() => setToggleOption(true)} />
                {toggleOption && (
                  <ChatMsgOption
                    msgId={data._id}
                    setToggleOption={setToggleOption}
                    isLastMsg={isLastMsg}
                  />
                )}
              </S.ChatMsgMoreIconWrapper>
            )}
          </S.ChatMsgRight>
        ) : (
          <S.ChatMsgLeft id={data._id} position={position}>
            <S.ChatMsgAvatar position={position}>
              <Image
                src={getSenderAvatar()}
                alt="avatar"
                layout="fill"
                objectFit="cover"
              />
            </S.ChatMsgAvatar>
            <S.ChatMsgWrapper
              onMouseEnter={() => onHoverMsg(true)}
              onMouseLeave={() => onHoverMsg(false)}
            >
              {toggleTooltip && (
                <S.ChatTooltip>{getSenderName()}</S.ChatTooltip>
              )}
              {!data.unSend && files.length === 0 && images.length === 0 && (
                <S.ChatMsgTextTail />
              )}
              {data.replyId && (
                <S.ChatMsgReply onClick={handleReplyClick}>
                  <S.ChatReplyLabel>
                    {replyLabel}
                    <MdOutlineReply />
                  </S.ChatReplyLabel>
                  {replyMsg &&
                    (replyMsg.type === 'image' ? (
                      <S.ChatMsgReplyImage>
                        <img src={replyMsg.msg} alt="reply img" />
                      </S.ChatMsgReplyImage>
                    ) : (
                      <S.ChatMsgReplyText>
                        {replyMsg.type === 'file' && (
                          <S.ChatMsgReplyFileIcon>
                            {getFileIcon({ name: replyMsg.msg })}
                          </S.ChatMsgReplyFileIcon>
                        )}
                        {replyMsg.msg}
                      </S.ChatMsgReplyText>
                    ))}
                </S.ChatMsgReply>
              )}
              {data.unSend ? (
                <S.ChatMsgUnSend>Message has been unsend</S.ChatMsgUnSend>
              ) : (
                <>
                  {data.msg !== '' && <S.ChatMsgText>{data.msg}</S.ChatMsgText>}
                  {images?.length > 0 && (
                    <S.ChatMsgFileImages imgNum={images?.length}>
                      {images?.map((image, index) => (
                        <S.ChatMsgFileImage
                          key={index}
                          imgNum={images?.length}
                          onClick={() => imageZoomClick(image._id)}
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
                          file.type === 'file' && (
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
            {!data.unSend && !isUnfriend && (
              <S.ChatMsgMoreIconWrapper>
                <S.ChatMsgMoreIcon
                  onClick={() => setToggleOption(true)}
                  isleft={1}
                />
                {toggleOption && (
                  <ChatMsgOption
                    msgId={data._id}
                    setToggleOption={setToggleOption}
                    isleft={1}
                    isLastMsg={isLastMsg}
                  />
                )}
              </S.ChatMsgMoreIconWrapper>
            )}
          </S.ChatMsgLeft>
        ))}
    </>
  );
};

export default ChatMsg;
