import { RequestHandler } from "@builder.io/qwik-city";
import Pusher from "pusher";
import { DEMO_ENV, PUSHER_CLUSTER, PUSHER_ID, PUSHER_PK, PUSHER_SK } from "~/constants";

export const onPost: RequestHandler = async ({ json, params, request }) => {
  console.log(DEMO_ENV)
  const pusher = new Pusher({
    appId: PUSHER_ID,
    key: PUSHER_PK,
    secret: PUSHER_SK,
    cluster: PUSHER_CLUSTER,
    useTLS: true,
  });

  const data = await request.json();
  const body = {
    message: data.message,
    from: params.workspace,
  };

  
  pusher.trigger("my-channel", "my-event", body);

  json(200, body);
};
