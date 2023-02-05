import { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ params }) => {
    // put your DB access here, we are hard coding a response for simplicity.
    return {
        id: params.id,
      price: 123.45,
      description: `Description for ${params.id}`,
    };
  };
  