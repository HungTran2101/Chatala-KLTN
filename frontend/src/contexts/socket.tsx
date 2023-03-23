import { createContext, useContext } from "react";
import io, { Socket } from "socket.io-client";
import { BASEURL } from "../services/api/urls";
import { ServerToClientEvents, ClientToServerEvents } from "../utils/types";

export type socketType = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
};

export const socket = io(BASEURL);
export const SocketContext = createContext(socket);

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }: any) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
