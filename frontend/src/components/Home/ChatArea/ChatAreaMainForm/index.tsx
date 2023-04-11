import { FormEvent, MutableRefObject, Ref } from "react";
import * as S from "./ChatAreaMainForm.styled";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import { useSelector } from "react-redux";
import { selectRoomInfoState } from "../../../../features/redux/slices/roomInfoSlice";
import { DropzoneInputProps } from "react-dropzone";
import { messageRawType } from "../../../../utils/types";

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
        <S.ChatAreaMainInputMsg>
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
