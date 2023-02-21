import { component$, QRL } from "@builder.io/qwik";

export default component$((props: { onClick$: QRL<any> }) => {
  return (
    <button
      onClick$={props.onClick$}
      type="button"
      class="ml-4 sm:ml-0 ring-1 shadow-sm dark:hover:bg-gray-800 hover:bg-gray-50 dark:ring-0 dark:shadow-highlight/4 group focus:outline-none focus-visible:ring-2 rounded-md focus-visible:ring-sky-500 dark:focus-visible:ring-2 dark:focus-visible:ring-gray-400"
    >
      <span class="sr-only">
        <span class="dark:hidden">Switch to dark theme</span>
        <span class="hidden dark:inline">Switch to light theme</span>
      </span>
      <svg
        width="36"
        height="36"
        viewBox="-6 -6 36 36"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="stroke-sky-500 fill-sky-100 group-hover:stroke-sky-600 dark:stroke-gray-400 dark:fill-gray-400/20 dark:group-hover:stroke-gray-300"
      >
        <g class="dark:opacity-0">
          <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
          <path
            d="M12 4v.01M17.66 6.345l-.007.007M20.005 12.005h-.01M17.66 17.665l-.007-.007M12 20.01V20M6.34 17.665l.007-.007M3.995 12.005h.01M6.34 6.344l.007.007"
            fill="none"
          ></path>
        </g>
        <g class="opacity-0 dark:opacity-100">
          <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"></path>
          <path
            d="M12 3v1M18.66 5.345l-.828.828M21.005 12.005h-1M18.66 18.665l-.828-.828M12 21.01V20M5.34 18.666l.835-.836M2.995 12.005h1.01M5.34 5.344l.835.836"
            fill="none"
          ></path>
        </g>
      </svg>
    </button>
  );
});
