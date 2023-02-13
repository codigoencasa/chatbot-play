import { createContext } from '@builder.io/qwik';
export interface IExecute {
    code:string
    loading?:boolean,
    result?:string
    preamble?:string
    after?:string
    running?:boolean
    workspace?:string
    messages: { message: string; direction: "in" | "out" }[];
}
export const ExecuteCtx = createContext<IExecute>('execute-ctx')