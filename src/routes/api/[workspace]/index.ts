import { RequestHandler } from "@builder.io/qwik-city";

// import {
//   PUSHER_CLUSTER,
//   PUSHER_ID,
//   PUSHER_PK,
//   PUSHER_SK,
// } from "~/constants";
// import WorkspaceModel from "~/model/workspace";

export const onPost: RequestHandler = async ({ json }) => {
  // const Pusher = await import('pusher')
  // //@ts-ignore
  // const pusher = new Pusher({
  //   appId: PUSHER_ID,
  //   key: PUSHER_PK,
  //   secret: PUSHER_SK,
  //   cluster: PUSHER_CLUSTER,
  //   useTLS: true,
  // });

  // const data = await request.json();
  // const body = {
  //   message: data.message,
  //   from: params.workspace,
  // };

  // pusher.trigger("my-channel", "my-event", body);

  json(200, {body:1});
};

export const onPut: RequestHandler = async ({ json }) => {
  // const slug = params.workspace as any
  // const body = await request.json();
  // const data = await WorkspaceModel.findOneAndUpdate({slug}, {...body,slug}, { upsert: true, new:true  });

  json(200, {data:1});
};

export const onGet: RequestHandler = async ({ json }) => {
  // const slug = params.workspace as any
  // const data = await WorkspaceModel.findOne({slug});
  json(200, {data:1});
};
