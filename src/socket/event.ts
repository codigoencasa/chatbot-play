

export const handleIOConnection = () => (socket: any) => {
  socket.on("join", (arg: {slug:string}) => {
    console.log(`workspace-${arg.slug}`)
    socket.join(`workspace-${arg.slug}`);
  });

  socket.on("ping", (arg: {slug:string,[key:string]:string}) => {
    console.log('RUN..', arg)
    socket.to(`workspace-${arg.slug}`).emit("pong", arg);
  });
};
