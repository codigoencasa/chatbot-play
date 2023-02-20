import { qwikify$ } from "@builder.io/qwik-react";
import {
  $,
  component$,
  noSerialize,
  useBrowserVisibleTask$,
  useContext,
  useSignal,
  useStore,
} from "@builder.io/qwik";

// import prettier from "prettier";
// import parserHtml from "prettier/parser-html";
// import parserCss from "prettier/parser-postcss";
// import parserBabel from "prettier/parser-babel";
import MonacoEditor from "@monaco-editor/react";
import { ExecuteCtx } from "~/contexts/execute.ctx";
import darkTheme from "~/assets/monaco/themes/dark-theme";
import lightTheme from "~/assets/monaco/themes/light.theme";

export const QMonaco = component$(() => {
  const MonacoEditor$ = qwikify$(MonacoEditor);
  const state = useContext(ExecuteCtx);

  const codeEditor = useSignal<any>();
  const loading = useSignal(false);
  const stateMonaco: any = useStore({
    monacoLanguage: "javascript",
    options: {
      selectOnLineNumbers: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      contextmenu: false,
    },
    loadingMessage: "🚀 Cargando...",
  });

  useBrowserVisibleTask$(() => {
    loading.value = true;
  });

  const handleMount: any = $(async (monacoEditor: any, monaco: any) => {
    codeEditor.value = noSerialize(monacoEditor);

    const { default: traverse } = await import("@babel/traverse");
    const { parse } = await import("@babel/parser");
    const { default: MonacoJSXHighlighter } = await import(
      "monaco-jsx-highlighter"
    );

    //jsx syntax highlight
    const babelParse = (code: any) =>
      parse(code, { sourceType: "module", plugins: ["jsx"] });

    const monacoJSXHighlighter = new MonacoJSXHighlighter(
      //@ts-ignore
      monaco,
      babelParse,
      traverse,
      monacoEditor
    );

    monacoJSXHighlighter.highLightOnDidChangeModelContent(
      0,
      () => {},
      () => {},
      undefined,
      () => {}
    );
  });

  const beforeMount = $((monaco: any) => {
    monaco.editor.defineTheme("vs-light", lightTheme);
    monaco.editor.defineTheme("vs-dark", darkTheme);
  });

  const handleChange = $((monacoValue: string | undefined) => {
    if (monacoValue) state.code = monacoValue;
    // await formatOnSave();
  });

  return (
    <div class={"h-[calc(100vh_-_60px)] monaco-editor"}>
      {loading.value ? (
        <MonacoEditor$
          onChange$={handleChange}
          onMount$={handleMount}
          language={"javascript"}
          options={stateMonaco.options}
          theme={state.theme}
          beforeMount={beforeMount}
          className="h-full"
          loading={''}
          value={state.code}
        />
      ) : null}
    </div>
  );
});
