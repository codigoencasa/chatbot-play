// @ts-ignore
import logoSrc from "~/assets/images/chatbot-whatsapp.png?width=64&height=64&png";

export const Logo = () => (
  <span class="self-center ml-2 text-2xl md:text-xl font-semibold dark:text-white text-gray-900 whitespace-nowrap flex items-center">
    <img
      src={logoSrc}
      class="inline-block mr-1"
      width={32}
      height={32}
      alt="Qwind Logo"
      loading="lazy"
    />
    Chatbot <span class={'pl-1 font-semibold text-[#25b637]'}>Play</span>
  </span>
);
