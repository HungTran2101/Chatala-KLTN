import React, { createContext, useContext, useState } from 'react';
import { messageType, UserRegister, roomInfo } from '../utils/types';

export type GlobalContent = {
  roomChoosen: boolean;
  setRoomChoosen: (value: boolean) => void;
};

export const GlobalContext = createContext<GlobalContent>({
  roomChoosen: false,
  setRoomChoosen: () => {},
});

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }: any) => {
  const [roomChoosen, setRoomChoosen] = useState(false);
  return (
    <GlobalContext.Provider
      value={{
        roomChoosen,
        setRoomChoosen,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
