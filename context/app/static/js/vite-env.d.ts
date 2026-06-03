/// <reference types="vite-plugin-svgr/client" />

// Note: we intentionally do NOT reference vite/client here -- it declares
// `*.svg` as a string URL, which conflicts with our svgr-emitted React
// component default exports (typed in ./typings/global.d.ts). The
// vite-plugin-svgr/client reference adds the `*.svg?react` variant.
