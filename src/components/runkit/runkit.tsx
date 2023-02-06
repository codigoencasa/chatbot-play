import {
  component$,
  useClientEffect$,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import { SAMPLE_CODE } from "~/data/code-example";
declare global {
  let RunKit: any;
}

export default component$((props: { preamble: string }) => {
  const stateHeight = useSignal(0);

  useTask$(({ track }) => {
    track(() => stateHeight.value);
  });

  useClientEffect$(() => {
    const script = document.createElement("script");
    const body = document.getElementsByTagName("body")[0];
    script.src = "//embed.runkit.com";
    body.appendChild(script);
    const htmlElement = document.getElementById("runkit-id");
    stateHeight.value = (htmlElement?.offsetHeight ?? 0) - 64;
    script.addEventListener("load", async () => {
      const notebook = RunKit.createNotebook({
        element: htmlElement,
        minHeight: `${stateHeight.value}px`,
        nodeVersion: "16.18.0",
        preamble: props.preamble,
        gutterStyle: "inside",
        source: SAMPLE_CODE,
      });

      notebook.onEvaluate = () => {};
      notebook.onLoad = () => {
        const frame = document.querySelector("iframe");
        console.log("Loaed", frame);
        if (frame) {
          const new_style_element = document.createElement("style");
          new_style_element.textContent = ".my-class { display: none; }";
          console.log("🤣🤣🤣", frame);
          frame?.contentDocument?.head.appendChild(new_style_element);
        }
      };
    });
  });

  return <div class={"h-full bg-white p-4 drop-shadow-xl rounded-lg"} id="runkit-id"></div>;
});
