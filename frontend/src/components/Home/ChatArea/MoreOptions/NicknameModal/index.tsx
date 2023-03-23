import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  roomInfoActions,
  selectRoomInfoState,
} from "../../../../../features/redux/slices/roomInfoSlice";
import { roomListActions } from "../../../../../features/redux/slices/roomListSlice";
import { selectUserState } from "../../../../../features/redux/slices/userSlice";
import { RoomApi } from "../../../../../services/api/room";
import { roomInfo, roomUser } from "../../../../../utils/types";
import * as S from "./NicknameModal.styled";

interface INickname {
  setToggleNickname: (toggle: boolean) => void;
  roomInfo: roomInfo;
  userNeedChange: roomUser;
}

const NicknameModal = ({
  setToggleNickname,
  roomInfo,
  userNeedChange,
}: INickname) => {
  const input = useRef<HTMLInputElement>();

  const dispatch = useDispatch();

  const saveNickname = async () => {
    try {
      await RoomApi.changeNickname(
        roomInfo.roomInfo._id,
        userNeedChange.uid,
        input.current.value
      );
      dispatch(
        roomInfoActions.changeNickname({
          uid: userNeedChange.uid,
          nickname: input.current.value,
        })
      );
      !roomInfo.roomInfo.isGroup &&
        dispatch(
          roomListActions.changeNickname({
            roomId: roomInfo.roomInfo._id,
            nickname: input.current.value,
          })
        );
      setToggleNickname(false);
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  return (
    <S.NicknameModal>
      <S.NicknameOverlay onClick={() => setToggleNickname(false)} />
      <S.NicknameBody>
        <S.NicknameTitle>
          Change nickname for {roomInfo.roomName}
        </S.NicknameTitle>
        <S.NicknameInput maxLength={50} ref={input} />
        <S.NicknameSave onClick={saveNickname}>Save</S.NicknameSave>
      </S.NicknameBody>
    </S.NicknameModal>
  );
};

export default NicknameModal;
