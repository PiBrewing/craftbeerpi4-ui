import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";

// The python server mounts each controller as an aiohttp subapp under its own
// prefix. Everything here is proxied to the backend in dev; in production the UI
// is served by that same server so the relative paths just work.
const API_PREFIXES = [
  "/actor",
  "/config",
  "/dashboard",
  "/fermenter",
  "/fermenterrecipe",
  "/kettle",
  "/log",
  "/login",
  "/notification",
  "/plugin",
  "/recipe",
  "/sensor",
  "/step",
  "/system",
  "/upload",
];

// Keys are matched as regexes so a prefix only matches at a path boundary.
// A bare "/log" string key also swallows /logo192.png, which is a real static
// asset referenced by index.html -- it would be proxied to the backend and come
// back as a 500. Static files must win over API prefixes.
const devProxy = () => ({
  "^/ws$": { target: "ws://localhost:8000", ws: true },
  ...Object.fromEntries(
    API_PREFIXES.map((p) => [
      `^${p}(/|$)`,
      { target: "http://localhost:8000", changeOrigin: true },
    ])
  ),
});

// The UI is served under the /cbpi_ui subpath by the CraftBeerPi python server,
// so every asset URL has to stay relative. Pairs with the HashRouter in App.js.
export default defineConfig({
  base: "./",
  // svgr covers the one CRA-ism left in the source: the `import { ReactComponent
  // as X } from "./x.svg"` in components/util/PrivateRoute.js.
  plugins: [react(), svgr({ include: "**/*.svg" }), nodePolyfills()],

  // Note on JSX: this project used to keep JSX inside .js files (CRA allowed it).
  // Vite 8 transforms with oxc, whose native build-time pass infers the parse
  // language from the file extension -- .js means JSX off, and no config option
  // overrides it (`lang` is deliberately absent from Vite's OxcOptions type).
  // The 119 files containing JSX were renamed to .jsx during the migration, which
  // is the idiomatic layout. Imports are extensionless, so resolution is unchanged.

  // Keeps the existing REACT_APP_* vars in .env working without renaming them.
  envPrefix: ["REACT_APP_", "VITE_"],

  build: {
    outDir: "build",
    // The CRA build shipped without sourcemaps (GENERATE_SOURCEMAP=false).
    sourcemap: false,
    // MANIFEST.in globs build/static/**, and CRA emitted there. Keep it.
    assetsDir: "static",
  },

  // cbpi serves the websocket from the same aiohttp app as the API, on the same
  // port -- not the 8080 the old .env assumed.
  server: {
    port: 3000,
    proxy: devProxy(),
  },

  // Same proxy for `vite preview`, so the production bundle can be exercised
  // against a real backend without reinstalling the python plugin.
  preview: {
    port: 4173,
    proxy: devProxy(),
  },

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    // Components reach for the API on mount, so tests stub axios rather than
    // hitting a backend. Without this, a failed restore leaks between files.
    restoreMocks: true,
  },
});
