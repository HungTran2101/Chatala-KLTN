import * as S from './ChatArea.styled';
import { FormEvent, useRef, useState, useEffect, useCallback } from 'react';
import MoreOptions from './MoreOptions';
import { validImageTypes } from '../../Global/ProcessFunctions';
import * as Yup from 'yup';
import { Formik } from 'formik';
import FilePreview from './FilePreview';
import DropZone from 'react-dropzone';
import {
  fileType,
  messageRawType,
  messageSendType,
} from '../../../utils/types';
import ChatImageZoom from './ChatImageZoom';
import { useDispatch, useSelector } from 'react-redux';
import {
  messageActions,
  selectMessageState,
} from '../../../features/redux/slices/messageSlice';
import { selectRoomInfoState } from '../../../features/redux/slices/roomInfoSlice';
import {
  API_KEY,
  MessageApi,
  CLOUD_NAME,
  UPLOAD_PRESET,
} from '../../../services/api/messages';
import { debounce } from 'lodash';
import { selectUserState } from '../../../features/redux/slices/userSlice';
import { API_URL } from '../../../services/api/urls';
import { useSocketContext } from '../../../contexts/socket';
import { fileActions } from '../../../features/redux/slices/fileSlice';
import ChatAreaHead from './ChatAreaHead';
import ChatAreaMainMsg from './ChatAreaMainMsg';
import ChatAreaMainForm from './ChatAreaMainForm';
import { useRouter } from 'next/router';
import {
  selectUtilState,
  utilActions,
} from '../../../features/redux/slices/utilSlice';
import { RoomApi } from '../../../services/api/room';
import { selectFriendListState } from '../../../features/redux/slices/friendListSlice';
import { message } from 'antd';

const ChatArea = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const roomInfo = useSelector(selectRoomInfoState);
  const friends = useSelector(selectFriendListState);
  const user = useSelector(selectUserState);
  const util = useSelector(selectUtilState);
  const messages = useSelector(selectMessageState);
  const socket = useSocketContext();

  const currentRoom = roomInfo.info.roomInfo._id;

  const bottomDiv = useRef<HTMLDivElement>(null);
  const chatMainMsgOuter = useRef<HTMLDivElement>(null);

  const [toggleImageZoom, setToggleImageZoom] = useState(false);
  const [imageId, setImageId] = useState<string>(null);
  const [toggleTyping, setToggleTyping] = useState(false);
  const [sendTyping, setSendTyping] = useState(false);
  const [newMsgNoti, setNewMsgNoti] = useState(false);
  const [chatScrollBottom, setChatScrollBottom] = useState(false);
  const [chatScrollTop, setChatScrollTop] = useState(false);
  const [chatLoadCounter, setChatLoadCounter] = useState<number>(1);

  //Handle Typing and Receive new messages
  useEffect(() => {
    //@ts-ignore
    socket.on('typing', () => {
      console.log('typing');
      setToggleTyping(true);
    });
    socket.on('stop typing', () => {
      console.log('stop typing');
      setToggleTyping(false);
    });
    // @ts-ignore
    socket.on('receiveMessage', (result) => {
      //add new message if not sender
      if (result.senderId !== user.info._id) {
        if (
          chatMainMsgOuter.current &&
          chatMainMsgOuter.current.scrollTop < 0
        ) {
          setNewMsgNoti(true);
        }
        dispatch(messageActions.newMessage(result));
      }
    });
    socket.on('receiveFiles', (files) => {
      dispatch(fileActions.setFilesData(files));
    });
  }, []);
  const debounceTyping = useCallback(
    debounce(() => {
      //@ts-ignore
      socket.emit('stop typing', roomInfo.info?.roomInfo._id);
      setSendTyping(false);
    }, 1500),
    []
  );
  const onInputChange = () => {
    if (!sendTyping) {
      setSendTyping(true);
      //@ts-ignore
      socket.emit('typing', roomInfo.info?.roomInfo._id);
    }
    debounceTyping();
  };

  //Handle scroll to new msg
  const scrollToNewMsg = () => {
    if (bottomDiv.current)
      bottomDiv.current.scrollIntoView({ behavior: 'smooth' });
  };
  const newMsgNotiClick = () => {
    scrollToNewMsg();
    setNewMsgNoti(false);
  };
  const checkChatScrollBottom = async (e: any) => {
    //e.target.scrollTop is bottom when value is 0, scroll up cause value goes negative
    const offset = 100;

    // console.log('clientHeight', e.target.clientHeight);
    // console.log('scrollTop', e.target.scrollTop);
    // console.log('scrollHeight', e.target.scrollHeight);

    const scrollPosition = e.target.clientHeight - e.target.scrollTop;

    //Check if chat scroll reach top
    if (scrollPosition > e.target.scrollHeight - offset && scrollPosition <= e.target.scrollHeight) {
      if (!chatScrollTop) {
        setChatScrollTop(true);
        setChatLoadCounter(chatLoadCounter + 1);

        const res = await MessageApi.get(
          roomInfo.info.roomInfo._id,
          chatLoadCounter + 1
        );
        if (res.messages.length > 0) {
          dispatch(messageActions.loadMessage(res.messages));
        } else {
          setChatScrollTop(false);
          setChatLoadCounter(chatLoadCounter);
        }
      }
    } else {
      if (chatScrollTop) {
        setChatScrollTop(false);
      }
    }

    //Check if chat scroll reach bottom
    if (e.target.scrollTop >= 0) {
      setNewMsgNoti(false);
    }
    //Check if chat scroll smaller than -500px then show scroll down button
    if (e.target.scrollTop > -500) {
      setChatScrollBottom(false);
    } else {
      setChatScrollBottom(true);
    }
  };
  useEffect(() => {
    if (messages.list.length <= 20) {
      //which mean different room got selected
      setChatLoadCounter(1);
    }
  }, [messages]);

  //Form
  const initialValues: messageRawType = {
    roomId: roomInfo?.info.roomInfo._id || '',
    msg: '',
    files: [],
    replyId: null,
    mentions: [],
  };
  const validationSchema = Yup.object().shape({
    msg: Yup.string(),
    files: Yup.mixed(),
  });

  //File
  const fileChoosen = (
    e: FormEvent<HTMLInputElement>,
    values: messageRawType,
    setFieldValue: any
  ) => {
    if (e.currentTarget.files) {
      const newFiles = e.currentTarget.files;

      const files = values.files;
      for (let i = 0; i < newFiles.length; i++) {
        files.push(newFiles[i]);
      }

      setFieldValue('files', files);
      e.currentTarget.value = '';
    }
  };

  const fileDropped = (
    newFiles: File[],
    values: messageRawType,
    setFieldValue: any
  ) => {
    const files = values.files;
    for (let i = 0; i < newFiles.length; i++) {
      files.push(newFiles[i]);
    }
    setFieldValue('files', files);
  };

  const uploadFile = async (
    file: File,
    signedKey: { signature: string; timestamp: number }
  ) => {
    const name = validImageTypes.includes(file.type) ? 'Image' : file.name;
    const type = validImageTypes.includes(file.type) ? 'image' : 'file';

    const form = new FormData();
    form.append('file', file);
    form.append('api_key', API_KEY);
    form.append('upload_preset', UPLOAD_PRESET);
    form.append('timestamp', signedKey.timestamp.toString());
    form.append('signature', signedKey.signature);

    // let uploadedFile: any = undefined;
    const response = await fetch(
      `${API_URL.uploadFile}/${CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: form,
      }
    ).then((response) => {
      return response.json();
    });
    // const uploadedFile = await MessageApi.uploadFile(form);
    if (response.secure_url)
      return {
        name,
        url: response.secure_url,
        type,
        roomId: roomInfo.info.roomInfo._id,
      };
    else return undefined;
  };

  //Upload files
  const uploadFiles = async (files: File[]) => {
    const signedKey = await MessageApi.getSignedKey();

    let uploadedFiles = [];

    // This for loop won't run if no files are selected
    for (let i = 0; i < files.length; i++) {
      const uploadedFile = await uploadFile(files[i], signedKey);
      uploadedFile && uploadedFiles.push(uploadedFile);
    }

    return uploadedFiles;
  };

  //Submit
  const onSubmit = async (values: messageRawType, { setFieldValue }: any) => {
    if (values.msg.trim() !== '' || values.files.length > 0) {
      values.replyId = util.replyId;

      try {
        const uploadedFiles: fileType[] = await uploadFiles(values.files);
        if (uploadedFiles.length <= 0 && values.files.length > 0) {
          message.error('Upload files failed! Try again later.');
          return;
        }
        let fileIds = [];
        if (uploadedFiles.length > 0) {
          const res = await MessageApi.saveFile(uploadedFiles);
          fileIds = res.fileIds;
          const _res = await MessageApi.getFile(roomInfo.info.roomInfo._id);
          dispatch(fileActions.setFilesData(_res.files));
          socket.emit('sendFiles', roomInfo.info.roomInfo._id, _res.files);
        }

        //setup message to save to DB
        const messageToSend: messageSendType = {
          roomId: roomInfo.info.roomInfo._id,
          msg: values.msg,
          replyId: values.replyId,
          fileIds,
          mentions: values.mentions,
        };

        const res = await MessageApi.send(messageToSend);
        await RoomApi.incUnreadMsg(user.info._id, roomInfo.info.roomInfo._id);
        dispatch(messageActions.newMessage(res.result));
        dispatch(utilActions.clearReplyId());
        setFieldValue('files', []);
        scrollToNewMsg();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleCallNavigate = async () => {
    // const token = await sessionStorage.getItem('callToken');
    // const meetingId = await CallApi.createMeeting({ token });
    // await sessionStorage.setItem('meetingId', meetingId);
    // console.log(meetingId);
    router.push({ pathname: '/video-call', query: { action: 'create' } });
  };

  const [isUnfriend, setIsUnfriend] = useState(false);
  useEffect(() => {
    if (friends.list.length > 0) {
      const friend = friends.list.find(
        (fr) => fr.friendRelateId === roomInfo.info.roomInfo.friendRelateId
      );
      if (friend) {
        if (friend.type === 'available') {
          setIsUnfriend(false);
        } else setIsUnfriend(true);
      }
    }
  }, [roomInfo, friends]);

  const [openMoreOption, setOpenMoreOption] = useState(false);

  const showDrawer = () => {
    setOpenMoreOption(true);
  };

  const onCloseDrawer = () => {
    setOpenMoreOption(false);
  };

  return (
    <>
      {toggleImageZoom && (
        <ChatImageZoom
          setToggleImageZoom={setToggleImageZoom}
          currentImgId={imageId}
        />
      )}
      <S.ChatArea>
        <ChatAreaHead setToggleOption={showDrawer} isUnfriend={isUnfriend} />
        <MoreOptions
          roomInfo={roomInfo.info!}
          setToggleOption={onCloseDrawer}
          toggleOption={openMoreOption}
          setToggleImageZoom={setToggleImageZoom}
          setImageId={setImageId}
          isUnfriend={isUnfriend}
          setIsUnfriend={setIsUnfriend}
        />
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {({ values, setFieldValue, submitForm, isSubmitting }) => (
            <DropZone
              onDrop={(acceptedFiles) =>
                fileDropped(acceptedFiles, values, setFieldValue)
              }
              noClick
              noKeyboard
            >
              {({ getRootProps, getInputProps, isDragActive }) => (
                <S.ChatAreaMain {...getRootProps()}>
                  <ChatAreaMainMsg
                    bottomDiv={bottomDiv}
                    chatMainMsgOuter={chatMainMsgOuter}
                    isSubmitting={isSubmitting}
                    newMsgNoti={newMsgNoti}
                    toggleTyping={toggleTyping}
                    isUnfriend={isUnfriend}
                    chatScrollTop={chatScrollTop}
                    setImageId={setImageId}
                    setToggleImageZoom={setToggleImageZoom}
                    checkChatScrollBottom={checkChatScrollBottom}
                    newMsgNotiClick={newMsgNotiClick}
                  />
                  {chatScrollBottom && (
                    <S.ChatAreaMainScrollBottom onClick={scrollToNewMsg} />
                  )}
                  {values.files.length > 0 && (
                    <S.ChatChatAreaFilePreview>
                      <S.ChatChatAreaFilePreviewInner>
                        {values.files.map((data, index) => (
                          <FilePreview
                            files={values.files}
                            setFieldValue={setFieldValue}
                            index={index}
                            key={index}
                          />
                        ))}
                      </S.ChatChatAreaFilePreviewInner>
                    </S.ChatChatAreaFilePreview>
                  )}

                  {!isUnfriend || roomInfo.info.roomInfo.isGroup ? (
                    <ChatAreaMainForm
                      isDragActive={isDragActive}
                      values={values}
                      isSubmitting={isSubmitting}
                      fileChoosen={fileChoosen}
                      getInputProps={getInputProps}
                      onInputChange={onInputChange}
                      setFieldValue={setFieldValue}
                      submitForm={submitForm}
                    />
                  ) : (
                    <i>You can&apos;t chat to this conversation </i>
                  )}
                </S.ChatAreaMain>
              )}
            </DropZone>
          )}
        </Formik>
      </S.ChatArea>
    </>
  );
};

export default ChatArea;
