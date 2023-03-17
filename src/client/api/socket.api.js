import { API_ENDPOINT } from "./api_endpoint"
import { io } from "socket.io-client";

export const connect = () => {
  return io(API_ENDPOINT);
}

export const disconnect = (socket) => {
  socket.disconnect();
}

export const joinRoom = (socket, roomId) => {
  socket.emit("joinRoom", roomId);
}
