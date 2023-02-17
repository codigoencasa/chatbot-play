declare global {
  interface Window {
    bc: Function;
  }
}

export const initBroadcastChannel = (addMessage: any) => {
  if (window && !window.bc) {
    window.bc = (cb: Function) => {
      const data = cb();
      addMessage(data);
    };
  }
};
