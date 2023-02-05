import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const handleIOConnection = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => (socket: any) => {
  socket.on("join", (arg: {slug:string}) => {
    console.log(`workspace-${arg.slug}`)
    socket.join(`workspace-${arg.slug}`);
  });

  socket.on("ping", (arg: {slug:string,[key:string]:string}) => {
    console.log('RUN..', arg)
    io.to(`workspace-${arg.slug}`).emit("pong", arg);
  });
};
