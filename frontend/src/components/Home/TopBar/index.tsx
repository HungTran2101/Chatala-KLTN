import Image from "next/image";
import * as S from "./TopBar.styled";
import React, { useEffect, useState } from "react";
import Logo from "../../../assets/imgs/LogoFullLong.png";
import UserInfo from "./UserInfo";
import NotiModal from "./NotiModal";
import SettingsModal from "./SettingsModal";
import { UsersApi } from "../../../services/api/users";
import SearchModal from "./SearchModal";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUserState,
  userActions,
} from "../../../features/redux/slices/userSlice";
import { useRouter } from "next/router";
import { SearchResult } from "../../../utils/types";
import {
  roomInfoActions,
  selectRoomInfoState,
} from "../../../features/redux/slices/roomInfoSlice";
import { roomListActions } from "../../../features/redux/slices/roomListSlice";
import { FriendApi } from "../../../services/api/friend";
import { useSocketContext } from "../../../contexts/socket";

const TopBar = () => {
  const [userInfoModal, setUserInfoModal] = useState(false);
  const [activeNotiModal, setActiveNotiModal] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchModal, setSearchModal] = useState(false);
  const [action, setAction] = useState(false);

  const socket = useSocketContext();
  const user = useSelector(selectUserState);
  const roomInfo = useSelector(selectRoomInfoState);
  const dispatch = useDispatch();
  const router = useRouter();

  const [listNoti, setListNoti] = useState([]);

  const getLoggedUser = async () => {
    const result = await UsersApi.getLoggedUser();
    if (result) dispatch(userActions.setUserInfo(result));
  };

  const getListNotify = async () => {
    const listNotify = await FriendApi.friendRequestList();
    setListNoti(listNotify);
  };

  const logout = async () => {
    await UsersApi.logout();
    //@ts-ignore
    socket.emit("logout", roomInfo.info?.roomInfo._id);
    dispatch(userActions.clearUserInfo(null));
    dispatch(roomInfoActions.clearRoomInfo(null));
    dispatch(roomListActions.clearRoomList(null));
    router.push("/login");
  };

  const getSearchResult = async () => {
    if (searchInput) {
      try {
        const res = await UsersApi.userFind({ search: searchInput });
        setSearchResult(res.result);
        setSearchModal(true);
      } catch (err) {
        console.log(err);
      }
    } else {
      setSearchResult([]);
      setSearchModal(false);
    }
  };

  useEffect(() => {
    getLoggedUser();
    getListNotify();
    socket.on("receiveNoti", () => {
      getListNotify();
    });
  }, []);

  useEffect(() => {
    if (user.loading === false && user.info._id !== "") {
      // @ts-ignore
      socket.emit("logged", user.info._id);
      // @ts-ignore
      socket.on("getUsers", (users) => {
        console.log(users);
        dispatch(
          roomListActions.setActiveRoom({ users, loggedUid: user.info._id })
        );
      });
    }
  }, [user]);

  useEffect(() => {
    let t: any;
    t = setTimeout(() => {
      getSearchResult();
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);
  useEffect(() => {
    if (action) {
      getSearchResult();
      setAction(false);
    }
  }, [action]);

  return (
    <S.Container>
      <S.Wrapper>
        <S.LeftWrapper onClick={() => setUserInfoModal(true)}>
          <S.Avatar>
            {user.info.avatar !== "" && (
              <Image
                src={user.info.avatar}
                alt="avatar"
                layout="fill"
                objectFit="cover"
              />
            )}
          </S.Avatar>
          <S.UserName>{user.info.name}</S.UserName>
        </S.LeftWrapper>
        <S.RightWrapper>
          <S.LogoContainer>
            <S.Logo>
              <Image src={Logo} alt="logo" />
            </S.Logo>
          </S.LogoContainer>
          <S.Search>
            <S.SearchIcon />
            <S.SearchInput
              placeholder="Search..."
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
              onFocus={() => setSearchModal(true)}
            />
            {searchModal && searchInput && (
              <SearchModal
                setSearchModal={setSearchModal}
                searchResult={searchResult}
                setAction={setAction}
              />
            )}
          </S.Search>
          <S.Option>
            <S.OptionNotifyWrapper>
              <S.OptionNotify onClick={() => setActiveNotiModal(true)} />
              {listNoti.length > 0 && (
                <S.OptionNotifyNumber number={listNoti.length}>
                  {listNoti.length < 100 ? listNoti.length : "99+"}
                </S.OptionNotifyNumber>
              )}
            </S.OptionNotifyWrapper>
            {activeNotiModal && (
              <NotiModal
                listNoti={listNoti}
                getListNotify={getListNotify}
                setActiveNotiModal={setActiveNotiModal}
              />
            )}
            <S.OptionSetting onClick={() => setSettingVisible(true)} />
            {settingVisible && (
              <SettingsModal
                setSettingVisible={() => setSettingVisible(false)}
              />
            )}
            <S.OptionLogOut onClick={() => logout()} />
          </S.Option>
        </S.RightWrapper>
        {userInfoModal && <UserInfo setUserInfoModal={setUserInfoModal} />}
      </S.Wrapper>
    </S.Container>
  );
};

export default TopBar;
