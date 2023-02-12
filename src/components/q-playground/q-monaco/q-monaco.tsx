import { qwikify$ } from "@builder.io/qwik-react";
import {
  $,
  component$,
  noSerialize,
  useClientEffect$,
  useContext,
  useSignal,
  useStore,
} from "@builder.io/qwik";

import prettier from "prettier";
import parserHtml from "prettier/parser-html";
import parserCss from "prettier/parser-postcss";
import parserBabel from "prettier/parser-babel";
import MonacoEditor from "@monaco-editor/react";
import { ExecuteCtx } from "~/contexts/execute.ctx";

export const QMonaco = component$(() => {
  const MonacoEditor$ = qwikify$(MonacoEditor);

  const state = useContext(ExecuteCtx);
  const codeEditor = useSignal<any>();
  const loading = useSignal(false);
  const stateMonaco = useStore({
    monacoLanguage: "javascript",
    options: {
      selectOnLineNumbers: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: "14px",
    },
    loadingMessage: "🚀 Cargando...",
  });

  useClientEffect$(() => {
    loading.value = true;
  });

  const handleMount: any = $(async (monacoEditor: any, monaco: any) => {
    codeEditor.value = noSerialize(monacoEditor);

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      "javascript.suggestionActions.enabled": false
    });
    

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

    //format code
    function formatOnSave() {
      const unformattedCode = codeEditor.value.current.getModel().getValue();
      const lang =
        codeEditor.value.current.getModel()._languageIdentifier.language;

      let config;

      switch (lang) {
        case "html":
          config = { parser: "html", plugin: [parserHtml] };
          break;

        case "css":
          config = { parser: "css", plugin: [parserCss] };
          break;

        case "javascript":
          config = { parser: "babel", plugin: [parserBabel] };
          break;

        default:
          break;
      }

      const formattedCode = prettier.format(unformattedCode, {
        parser: config && config.parser,
        plugins: config && config.plugin,
        useTabs: false,
        semi: true,
      });

      codeEditor.value.current.setValue(formattedCode);
    }

    //save command

    const handleOnKeyDown = codeEditor.value.onKeyDown((event: KeyboardEvent) => {
      if (
        (window.navigator.platform.match("Mac")
          ? event.metaKey
          : event.ctrlKey) &&
        event.code === "KeyS"
      ) {
        event.preventDefault();
        formatOnSave();
      }
    });

    //cleaning up
    return () => handleOnKeyDown.dispose();
  });

  const handleChange = $((monacoValue: string | undefined) => {
    if (monacoValue) state.code = monacoValue;
  });

  return (
    <div class={"h-[calc(100vh_-_60px)]"}>
      {loading.value ? (
        <MonacoEditor$
          onChange$={handleChange}
          onMount$={handleMount}
          language={"javascript"}
          options={stateMonaco.options}
          theme="light"
          className="h-full"
          loading={stateMonaco.loadingMessage}
          value={state.code}
        />
      ) : (
        <div class={'flex items-center justify-center content-center h-full w-full'}>{stateMonaco.loadingMessage}</div>
      )}
    </div>
  );
});
