import { PUSHER_CLUSTER, PUSHER_PK } from "~/constants";

declare global {
  let Pusher:any
  interface Window {
    bc: Function;
    pusher: any;
    pusherChannel: any;
  }
}

export const initBroadcastChannel = (addMessage: any) => {
  const pusher = new Pusher(PUSHER_PK, {
    cluster: PUSHER_CLUSTER,
  });

  if (window && !window.pusher) {
    window.pusher = pusher;
    window.pusherChannel = window.pusher.subscribe("my-channel");
  }

  if (window && !window.bc) {
    window.bc = (cb: Function) => {
      const data = cb();
      addMessage(data);
    };
  }
};
