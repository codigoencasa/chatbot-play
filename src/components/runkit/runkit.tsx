import {
  component$,
  noSerialize,
  useClientEffect$,
  useContext,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import { GeneralCTX } from "~/contexts/general.ctx";
import { SAMPLE_CODE } from "~/data/code-example";
declare global {
  interface Window {
    RunKit: any;
  }
}

export const OverlayRunkit = component$((props:{runkitEmbed:any}) => {
  const stateGeneral = useContext(GeneralCTX);
  return(<div class={'bg-red-400'}>{stateGeneral.runkitrunning ? 'FUNCIONA':'APAGADO'}
    <button onClick$={() => props.runkitEmbed.value?.evaluate()}>TEST</button> 
  
  </div>)
})

export default component$((props: { preamble: string }) => {
  const stateHeight = useSignal(0);
  const runkitEmbed = useSignal<any>()
  const stateGeneral = useContext(GeneralCTX);

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
        hidesEndpointLogs:true,
        hidesActionButton:true
      });

      runkitEmbed.value = noSerialize(notebook)
      notebook.onEvaluate = () => {
        stateGeneral.runkitrunning = true
        setTimeout(() =>   stateGeneral.runkitrunning = false, 55000)
      };

      notebook.destroy = () => console.log('⚡⚡')

      notebook.onLoad = () => {
      
      };
    });
  });

  return (
    <>
    <OverlayRunkit runkitEmbed={runkitEmbed} />
    <div class={"h-full bg-white p-4 drop-shadow-xl rounded-lg"} id="runkit-id"></div>
    </>
  );
});
