import { VITE_URL } from "~/constants";

export const connectToSocket = (io: (arg0: any, arg1: { reconnectionDelayMax: number; }) => any) => {
    const socket = io(VITE_URL, {
      reconnectionDelayMax: 10000,
    });

    return socket


  };