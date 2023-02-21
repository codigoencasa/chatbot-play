import { createContextId } from "@builder.io/qwik";
export interface IExecute {
  code: string;
  loading?: boolean;
  loadingMessage?: string;
  result?: string;
  preamble?: string;
  after?: string;
  running?: boolean;
  workspace?: string;
  ready?: boolean;
  theme: string;
  messages: { message: string; direction: "in" | "out" }[];
}
export const ExecuteCtx = createContextId<IExecute>("execute-ctx");
