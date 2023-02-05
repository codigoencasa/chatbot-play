import { createContext } from "@builder.io/qwik";

export const MessageCTX = createContext<{messages:any[]}>('message-ctx')