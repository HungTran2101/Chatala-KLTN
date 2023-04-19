import { FormEvent, MutableRefObject, Ref, useState, useEffect } from "react";
import * as S from "./ChatAreaMainForm.styled";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import { selectRoomInfoState } from "../../../../features/redux/slices/roomInfoSlice";
import { DropzoneInputProps } from "react-dropzone";
import { messageRawType, roomUser } from "../../../../utils/types";
import {
  selectUtilState,
  utilActions,
} from "../../../../features/redux/slices/utilSlice";
import { selectMessageState } from "../../../../features/redux/slices/messageSlice";
import { selectFileState } from "../../../../features/redux/slices/fileSlice";
import Image from "next/image";
import { getReplyInfo } from "../../../Global/ProcessFunctions";
import { selectUserState } from "../../../../features/redux/slices/userSlice";

interface IChatAreaMainForm {
  setFieldValue: any;
  toggleEmoji: boolean;
  emojiRef: MutableRefObject<HTMLInputElement>;
  chatInput: Ref<HTMLSpanElement>;
  values: messageRawType;
  isDragActive: boolean;
  isSubmitting: boolean;
  emojiClicked: (emoData: EmojiClickData, setFieldValue: any) => void;
  setToggleEmoji: (toggleEmoji: boolean) => void;
  onInputChange: () => void;
  submitForm: () => void;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
  fileChoosen: (
    e: FormEvent<HTMLInputElement>,
    values: messageRawType,
    setFieldValue: any
  ) => void;
}

const ChatAreaMainForm = ({
  setFieldValue,
  emojiRef,
  toggleEmoji,
  chatInput,
  values,
  isDragActive,
  isSubmitting,
  emojiClicked,
  setToggleEmoji,
  onInputChange,
  submitForm,
  getInputProps,
  fileChoosen,
}: IChatAreaMainForm) => {
  const roomInfo = useSelector(selectRoomInfoState);
  const util = useSelector(selectUtilState);
  const messages = useSelector(selectMessageState);
  const roomfiles = useSelector(selectFileState);
  const user = useSelector(selectUserState);

  const dispatch = useDispatch();

  const [replyMsg, setReplyMsg] = useState<{ msg: string; type: string }>(
    undefined
  );
  const [replyTarget, setReplyTarget] = useState<roomUser>(undefined);

  const findReplyInfo = () => {
    const result = getReplyInfo(
      messages.list,
      util.replyId,
      roomfiles.list,
      roomInfo.info.roomInfo.users
    );

    if(result){
      setReplyMsg(result.replyMsg);
      setReplyTarget(result.replyTarget);
    }
  };

  useEffect(() => {
    if (util.replyId) {
      findReplyInfo();
    }
  }, [util.replyId]);

  const cancleReply = () => {
    dispatch(utilActions.clearReplyId());
    setReplyMsg(undefined);
    setReplyTarget(undefined);
  };

  return (
    <S.ChatAreaMainForm>
      <S.ChatAreaMainInput>
        {toggleEmoji && (
          <S.ChatAreaMainInputEmojiPicker ref={emojiRef}>
            <EmojiPicker
              skinTonesDisabled={true}
              emojiStyle={EmojiStyle.TWITTER}
              height={400}
              width={400}
              onEmojiClick={(emoData) => emojiClicked(emoData, setFieldValue)}
            />
          </S.ChatAreaMainInputEmojiPicker>
        )}
        <S.ChatAreaMainInputFile htmlFor="fileInput">+</S.ChatAreaMainInputFile>
        <S.ChatAreaMainInputMsgOuter>
          {util.replyId && replyMsg && (
            <S.ChatAreaMainInputReply isImg={replyMsg.type === "image" ? "true" : "false"}>
              <S.ChatAreaMainInputReplyLabel>
                Replying to <b>{replyTarget.uid !== user.info._id ? replyTarget?.nickname : "yourself"}</b>:
              </S.ChatAreaMainInputReplyLabel>
              {replyMsg.type === "image" ? (
                <S.ChatAreaMainInputReplyImage>
                  <Image src={replyMsg.msg} alt="Image" layout="fill" />
                </S.ChatAreaMainInputReplyImage>
              ) : (
                <S.ChatAreaMainInputReplyContent>
                  {replyMsg.msg}
                </S.ChatAreaMainInputReplyContent>
              )}
              <S.ChatAreaMainInputReplyCancel onClick={cancleReply} />
            </S.ChatAreaMainInputReply>
          )}
          <S.ChatAreaMainInputMsg isReplying={util.replyId ? "true" : "false"}>
            <S.ChatAreaMainInputEmoji onClick={() => setToggleEmoji(true)} />
            <S.ChatAreaMainInputText
              username={roomInfo.info!.roomName}
              contentEditable
              ref={chatInput}
              onInput={() => onInputChange()}
              onKeyDown={(e) => {
                if (e.code === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submitForm();
                }
              }}
            />
            <S.ChatAreaMainInputButtonSend
              type="button"
              onClick={() => {
                if (!isSubmitting) {
                  submitForm();
                }
              }}
            >
              <S.ChatAreaMainInputSendIcon />
            </S.ChatAreaMainInputButtonSend>
          </S.ChatAreaMainInputMsg>
        </S.ChatAreaMainInputMsgOuter>
      </S.ChatAreaMainInput>
      <input
        {...getInputProps({
          type: "file",
          id: "fileInput",
          hidden: true,
          multiple: true,
          onChange: (e) => fileChoosen(e, values, setFieldValue),
        })}
      />
      {isDragActive && (
        <S.ChatAreaMainDropZone>Drop files here</S.ChatAreaMainDropZone>
      )}
    </S.ChatAreaMainForm>
  );
};

export default ChatAreaMainForm;
