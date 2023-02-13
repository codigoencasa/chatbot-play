import { component$, useClientEffect$, useContextProvider, useStore } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { GeneralCTX, IGeneralCtx } from "~/contexts/general.ctx";

export default component$(() => {
  const location = useLocation();

  const stateGeneral = useStore<IGeneralCtx>({
    messages:[],
    runkitrunning:false,
    slug:''
  })
  useContextProvider(GeneralCTX, stateGeneral)

  useClientEffect$(() => {
    const slug = location.params?.slug ?? null;
    stateGeneral.slug = slug
  });

  return (
    <div
      class={"relative bg-gray-100 p-2 px-4 h-[calc(100vh_-_60px)] flex gap-2"}
    >
      <div class={"w-full relative z-20 "}>
        {/* <Playground$ /> */}
        {/* <Runkit
          preamble={PREAMBLE({ slug: stateGeneral.slug, socketUrl: VITE_URL })}
        /> */}
      </div>
      {/* <div class={"w-1/2 relative  bg-gray-100 "}>
        <Device  />
      </div> */}
    </div>
  );
});
