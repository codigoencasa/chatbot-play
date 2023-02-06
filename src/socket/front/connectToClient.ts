import { SOCKET_ENDPOINT } from "~/constants";

export const connectToSocket = (io: (arg0: any, arg1: { reconnectionDelayMax: number; }) => any) => {
    const socket = io(SOCKET_ENDPOINT, {
      reconnectionDelayMax: 10000,
    });

    return socket


  };