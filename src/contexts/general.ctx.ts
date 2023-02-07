import { createContext } from "@builder.io/qwik";

export interface IGeneralCtx {
  runkitrunning: boolean;
  messages: { message: string; direction: "in" | "out" }[];
  slug: string;
}

export const GeneralCTX = createContext<IGeneralCtx>("general-context");
