import * as S from "./ChatArea.styled";
import { FormEvent, useRef, useState, useEffect, useCallback } from "react";
import { EmojiClickData } from "emoji-picker-react";
import MoreOptions from "./MoreOptions";
import {
  useOutsideClick,
  validImageTypes,
} from "../../Global/ProcessFunctions";
import * as Yup from "yup";
import { Formik } from "formik";
import FilePreview from "./FilePreview";
import DropZone from "react-dropzone";
import {
  fileType,
  messageRawType,
  messageSendType,
} from "../../../utils/types";
import ChatImageZoom from "./ChatImageZoom";
import { useDispatch, useSelector } from "react-redux";
import { messageActions } from "../../../features/redux/slices/messageSlice";
import { selectRoomInfoState } from "../../../features/redux/slices/roomInfoSlice";
import {
  API_KEY,
  MessageApi,
  CLOUD_NAME,
  UPLOAD_PRESET,
} from "../../../services/api/messages";
import { debounce } from "lodash";
import { selectUserState } from "../../../features/redux/slices/userSlice";
import { API_URL } from "../../../services/api/urls";
import { useSocketContext } from "../../../contexts/socket";
import { fileActions } from "../../../features/redux/slices/fileSlice";
import ChatAreaHead from "./ChatAreaHead";
import ChatAreaMainMsg from "./ChatAreaMainMsg";
import ChatAreaMainForm from "./ChatAreaMainForm";
import {
  selectUtilState,
  utilActions,
} from "../../../features/redux/slices/utilSlice";
import { RoomApi } from "../../../services/api/room";

const ChatArea = () => {
  const dispatch = useDispatch();

  const roomInfo = useSelector(selectRoomInfoState);
  const user = useSelector(selectUserState);
  const util = useSelector(selectUtilState);
  const socket = useSocketContext();

  const chatInput = useRef<HTMLSpanElement>(null);
  const bottomDiv = useRef<HTMLDivElement>(null);
  const chatMainMsgOuter = useRef<HTMLDivElement>(null);

  const [toggleEmoji, setToggleEmoji] = useState(false);
  const [toggleOption, setToggleOption] = useState(false);
  const [toggleImageZoom, setToggleImageZoom] = useState(false);
  const [imageZoomList, setImageZoomList] = useState<{
    index: number;
    list: fileType[];
  }>({ index: 0, list: [] });
  const [toggleTyping, setToggleTyping] = useState(false);
  const [sendTyping, setSendTyping] = useState(false);
  const [newMsgNoti, setNewMsgNoti] = useState(false);
  const [chatScrollBottom, setChatScrollBottom] = useState(false);
  const [formValues, setFormValues] = useState<messageRawType>({
    roomId: roomInfo.info?.roomInfo._id || "",
    msg: "",
    files: [],
    replyId: null,
  });

  //Handle Typing and Receive new messages
  useEffect(() => {
    //@ts-ignore
    socket.on("typing", () => {
      console.log("typing");
      setToggleTyping(true);
    });
    socket.on("stop typing", () => {
      console.log("stop typing");
      setToggleTyping(false);
    });
    // @ts-ignore
    socket.on("receiveMessage", (result) => {
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
    socket.on("receiveFiles", (files) => {
      console.log("receiveFile");
      dispatch(fileActions.setFilesData(files));
    });
  }, []);
  const debounceTyping = useCallback(
    debounce(() => {
      //@ts-ignore
      socket.emit("stop typing", roomInfo.info?.roomInfo._id);
      setSendTyping(false);
    }, 1500),
    []
  );
  const onInputChange = () => {
    if (!sendTyping) {
      setSendTyping(true);
      //@ts-ignore
      socket.emit("typing", roomInfo.info?.roomInfo._id);
    }
    debounceTyping();
  };

  //handle room change
  useEffect(() => {
    chatInput.current.innerText = "";
  }, [roomInfo.info]);

  //Handle scroll to new msg
  const scrollToNewMsg = () => {
    if (bottomDiv.current)
      bottomDiv.current.scrollIntoView({ behavior: "smooth" });
  };
  const newMsgNotiClick = () => {
    scrollToNewMsg();
    setNewMsgNoti(false);
  };
  const checkChatScrollBottom = () => {
    //e.target.scrollTop is bottom when value is 0, scroll up cause value goes negative
    //Check if chat scroll at bottom
    if (chatMainMsgOuter.current && chatMainMsgOuter.current.scrollTop >= 0) {
      setNewMsgNoti(false);
    }
    //Check if chat scroll smaller than -500px then show scroll down button
    if (chatMainMsgOuter.current && chatMainMsgOuter.current.scrollTop > -500) {
      setChatScrollBottom(false);
    } else {
      setChatScrollBottom(true);
    }
  };

  //Emoji
  const handleEmojiOutsideClick = () => {
    setToggleEmoji(false);
  };
  const emojiRef = useOutsideClick(handleEmojiOutsideClick);
  const emojiClicked = (emoData: EmojiClickData, setFieldValue: any) => {
    chatInput.current!.innerText = chatInput.current!.innerText + emoData.emoji;
    setFieldValue("msg", chatInput.current?.innerText);
  };

  //Form
  const initialValues = formValues;
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

      setFieldValue("files", files);
      setFormValues(values);
      e.currentTarget.value = "";
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
    setFieldValue("files", files);
    setFormValues(values);
  };

  const uploadFile = async (
    file: File,
    signedKey: { signature: string; timestamp: number }
  ) => {
    const name = validImageTypes.includes(file.type) ? "Image" : file.name;
    const type = validImageTypes.includes(file.type) ? "image" : "file";

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", API_KEY);
    form.append("upload_preset", UPLOAD_PRESET);
    form.append("timestamp", signedKey.timestamp.toString());
    form.append("signature", signedKey.signature);

    // let uploadedFile: any = undefined;
    const response = await fetch(
      `${API_URL.uploadFile}/${CLOUD_NAME}/auto/upload`,
      {
        method: "POST",
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
    if (chatInput.current.innerText.trim() !== "" || values.files.length > 0) {
      setToggleEmoji(false);
      values.msg = chatInput.current.innerText;
      values.replyId = util.replyId;

      try {
        const uploadedFiles: fileType[] = await uploadFiles(values.files);
        if (uploadedFiles.length <= 0 && values.files.length > 0) {
          alert("Upload files failed! Try again later.");
          return;
        }
        let fileIds = [];
        if (uploadedFiles.length > 0) {
          const res = await MessageApi.saveFile(uploadedFiles);
          fileIds = res.fileIds;
          const _res = await MessageApi.getFile(roomInfo.info.roomInfo._id);
          dispatch(fileActions.setFilesData(_res.files));
          socket.emit("sendFiles", roomInfo.info.roomInfo._id, _res.files);
        }

        //setup message to save to DB
        const messageToSend: messageSendType = {
          roomId: roomInfo.info.roomInfo._id,
          msg: values.msg,
          replyId: values.replyId,
          fileIds,
        };

        const res = await MessageApi.send(messageToSend);
        const res1 = await RoomApi.incUnreadMsg(user.info._id, roomInfo.info.roomInfo._id)
        console.log(res1);
        dispatch(messageActions.newMessage(res.result));
        dispatch(utilActions.clearReplyId());
        chatInput.current!.innerText = "";
        setFieldValue("files", []);
        scrollToNewMsg();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <S.ChatArea>
      <ChatAreaHead setToggleOption={setToggleOption} />
      {toggleOption && (
        <MoreOptions
          roomInfo={roomInfo.info!}
          setToggleOption={setToggleOption}
          toggleOption={toggleOption}
          setToggleImageZoom={setToggleImageZoom}
          setImageZoomList={setImageZoomList}
        />
      )}
      {toggleImageZoom && (
        <ChatImageZoom
          imageZoomList={imageZoomList.list}
          setToggleImageZoom={setToggleImageZoom}
          currentIndex={imageZoomList.index}
        />
      )}
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
                  setImageZoomList={setImageZoomList}
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
                <ChatAreaMainForm
                  chatInput={chatInput}
                  emojiClicked={emojiClicked}
                  emojiRef={emojiRef}
                  isDragActive={isDragActive}
                  toggleEmoji={toggleEmoji}
                  values={values}
                  isSubmitting={isSubmitting}
                  fileChoosen={fileChoosen}
                  getInputProps={getInputProps}
                  onInputChange={onInputChange}
                  setFieldValue={setFieldValue}
                  setToggleEmoji={setToggleEmoji}
                  submitForm={submitForm}
                />
              </S.ChatAreaMain>
            )}
          </DropZone>
        )}
      </Formik>
    </S.ChatArea>
  );
};

export default ChatArea;
