import { FormEvent, useState, useEffect, useMemo, useRef } from 'react';
import * as S from './ChatAreaMainForm.styled';
import EmojiPicker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectRoomInfoState } from '../../../../features/redux/slices/roomInfoSlice';
import { DropzoneInputProps } from 'react-dropzone';
import { MentionList, messageRawType, roomUser } from '../../../../utils/types';
import {
  selectUtilState,
  utilActions,
} from '../../../../features/redux/slices/utilSlice';
import { selectMessageState } from '../../../../features/redux/slices/messageSlice';
import { selectFileState } from '../../../../features/redux/slices/fileSlice';
import Image from 'next/image';
import {
  getReplyInfo,
  useOutsideClick,
} from '../../../Global/ProcessFunctions';
import { selectUserState } from '../../../../features/redux/slices/userSlice';
import { ContentState, EditorState, Modifier, convertToRaw } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin from '@draft-js-plugins/mention';

import '@draft-js-plugins/mention/lib/plugin.css';
import 'draft-js/dist/Draft.css';
import { FiFilePlus } from 'react-icons/fi';

interface IChatAreaMainForm {
  setFieldValue: any;
  values: messageRawType;
  isDragActive: boolean;
  isSubmitting: boolean;
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
  values,
  isDragActive,
  isSubmitting,
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
  const [toggleEmoji, setToggleEmoji] = useState(false);

  //Mention
  const refEditor = useRef<Editor>(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const getMentionList = (): MentionList => {
    const list: MentionList = [];
    roomInfo.info.roomInfo.users.forEach((urs) => {
      if (urs.uid !== user.info._id && !urs.isLeave)
        list.push({ name: urs.nickname, avatar: urs.avatar, uid: urs._id });
    });
    return list;
  };

  const mentionList: MentionList = getMentionList();
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<MentionList>(mentionList);

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      mentionPrefix: '@',
      supportWhitespace: true,
    });
    // eslint-disable-next-line no-shadow
    const { MentionSuggestions } = mentionPlugin;
    // eslint-disable-next-line no-shadow
    const plugins = [mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);

  //Editor Event
  const suggestionFilter = (searchValue: string, suggestData: MentionList) => {
    const value = searchValue.toLowerCase();

    const filteredSuggestions = suggestData.filter(
      (suggestion) =>
        value === '' ||
        !value ||
        (suggestion.name && suggestion.name.toLowerCase().indexOf(value) > -1)
    );

    return filteredSuggestions;
  };
  const onOpenChange = (_open: boolean) => {
    setOpen(_open);
  };
  const onSearchChange = ({ value }: { value: string }) => {
    setSuggestions(suggestionFilter(value, mentionList));
  };
  const onAddMention = (entry: any) => {
    // console.log(entry);
  };

  const editorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);

    const currentPlainText = editorState.getCurrentContent().getPlainText();
    const newPlainText = newEditorState.getCurrentContent().getPlainText();
    if (currentPlainText.trim() !== newPlainText.trim()) {
      onInputChange();
    }
  };
  const insertText = (text: string) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const newContentState = Modifier.insertText(
      contentState,
      selectionState,
      text
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'insert-characters'
    );
    editorChange(newEditorState);
  };

  //Emoji
  const handleEmojiOutsideClick = () => {
    setToggleEmoji(false);
  };
  const emojiRef = useOutsideClick(handleEmojiOutsideClick);
  const emojiClicked = (emoData: EmojiClickData) => {
    console.log(editorState.getCurrentContent().getPlainText() + emoData.emoji);
    insertText(emoData.emoji);
  };

  //Reply
  const findReplyInfo = () => {
    const result = getReplyInfo(
      messages.list,
      util.replyId,
      roomfiles.list,
      roomInfo.info.roomInfo.users
    );

    if (result) {
      setReplyMsg(result.replyMsg);
      setReplyTarget(result.replyTarget);
    }
  };

  useEffect(() => {
    if (util.replyId) {
      findReplyInfo();
    }
  }, [util.replyId]);

  //Room change
  const clearChatInput = () => {
    const newEditorState = EditorState.push(
      editorState,
      ContentState.createFromText(''),
      'remove-range'
    );
    setEditorState(newEditorState);
  };
  useEffect(() => {
    clearChatInput();
    setFieldValue('msg', '');
    setFieldValue('files', []);
    dispatch(utilActions.clearReplyId());
  }, [roomInfo.info]);

  const cancleReply = () => {
    dispatch(utilActions.clearReplyId());
    setReplyMsg(undefined);
    setReplyTarget(undefined);
  };

  const preprocessSubmit = () => {
    setFieldValue('msg', editorState.getCurrentContent().getPlainText());

    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    const mentionedUsers = [];
    for (let key in raw.entityMap) {
      const ent = raw.entityMap[key];
      if (ent.type === 'mention') {
        mentionedUsers.push({
          name: '@' + ent.data.mention.name,
          uid: ent.data.mention.uid,
        });
      }
    }
    setFieldValue('mentions', mentionedUsers);
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
              onEmojiClick={(emoData) => emojiClicked(emoData)}
            />
          </S.ChatAreaMainInputEmojiPicker>
        )}
        <S.ChatAreaMainInputFile htmlFor="fileInput">
          <FiFilePlus />
        </S.ChatAreaMainInputFile>
        <S.ChatAreaMainInputMsgOuter>
          {util.replyId && replyMsg && (
            <S.ChatAreaMainInputReply
              isImg={replyMsg.type === 'image' ? 'true' : 'false'}
            >
              <S.ChatAreaMainInputReplyLabel>
                {util.UIText.chatArea.chatAreaMain.inputReplyTo}{' '}
                <b>
                  {replyTarget.uid !== user.info._id
                    ? replyTarget?.nickname
                    : util.UIText.chatArea.chatAreaMain.yourself}
                </b>
                :
              </S.ChatAreaMainInputReplyLabel>
              {replyMsg.type === 'image' ? (
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
          <S.ChatAreaMainInputMsg isReplying={util.replyId ? 'true' : 'false'}>
            <S.ChatAreaMainInputEmoji onClick={() => setToggleEmoji(true)} />
            <S.ChatAreaMainInputText>
              <Editor
                editorState={editorState}
                onChange={editorChange}
                plugins={plugins}
                placeholder={`${util.UIText.chatArea.chatAreaMain.inputPlaceholder} ${roomInfo.info.roomName}...`}
                ref={refEditor}
              />
              {roomInfo.info.roomInfo.isGroup && (
                <MentionSuggestions
                  open={open}
                  onOpenChange={onOpenChange}
                  suggestions={suggestions}
                  onSearchChange={onSearchChange}
                  onAddMention={onAddMention}
                />
              )}
            </S.ChatAreaMainInputText>
            <S.ChatAreaMainInputButtonSend
              type="button"
              onClick={() => {
                if (!isSubmitting) {
                  preprocessSubmit();
                  submitForm();
                  clearChatInput();
                }
              }}
            >
              {isSubmitting ? (
                <S.ChatAreaMainInputLoading
                  size={15}
                  speedMultiplier={0.5}
                  color="#FFFFFF"
                />
              ) : (
                <S.ChatAreaMainInputSendIcon />
              )}
            </S.ChatAreaMainInputButtonSend>
          </S.ChatAreaMainInputMsg>
        </S.ChatAreaMainInputMsgOuter>
      </S.ChatAreaMainInput>
      <input
        {...getInputProps({
          type: 'file',
          id: 'fileInput',
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
