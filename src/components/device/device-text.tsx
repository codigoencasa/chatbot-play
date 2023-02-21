import { component$ } from "@builder.io/qwik";

export default component$(({text}:{text:string}) => {
    return (<div>{text}</div>)
})