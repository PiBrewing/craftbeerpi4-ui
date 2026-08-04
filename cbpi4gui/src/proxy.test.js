import { describe, expect, it } from "vitest";
import config from "../vite.config.mjs";

/**
 * The dev/preview proxy forwards API prefixes to the python backend. Vite
 * matches plain string keys by prefix, so a key like "/log" also captures
 * /logo192.png -- a real static asset in public/ that index.html references.
 * It then gets proxied to a backend with no such route and comes back a 500.
 *
 * These assert the proxy only matches at path boundaries.
 */
const resolved = typeof config === "function" ? config({ command: "serve", mode: "development" }) : config;

// Static files in public/ plus the built asset dir. None may match a proxy rule.
const STATIC_PATHS = [
  "/logo192.png",
  "/logo512.png",
  "/favicon.ico",
  "/manifest.json",
  "/robots.txt",
  "/paypal.png",
  "/static/index-abc123.js",
  "/static/index-abc123.css",
];

// Paths that must still reach the backend. Only real routes belong here: the
// log subapp is mounted at "/log", and logapi only ever calls "/log/<id>".
// Anything else under /log* is not an endpoint -- the backend 500s on unknown
// paths, which is exactly how /logo192.png surfaced.
const API_PATHS = [
  "/log/",
  "/log/123",
  "/actor/",
  "/sensor/1",
  "/kettle/",
  "/config/BREWERY_NAME/",
  "/system/",
  "/ws",
];

const matches = (proxy, path) =>
  Object.keys(proxy).filter((key) =>
    key.startsWith("^") ? new RegExp(key).test(path) : path.startsWith(key)
  );

describe.each([
  ["server", resolved.server?.proxy],
  ["preview", resolved.preview?.proxy],
])("%s proxy", (name, proxy) => {
  it("is configured", () => {
    expect(proxy).toBeTruthy();
    expect(Object.keys(proxy).length).toBeGreaterThan(0);
  });

  it.each(STATIC_PATHS)("does not capture the static asset %s", (path) => {
    expect(matches(proxy, path)).toEqual([]);
  });

  it.each(API_PATHS)("still routes %s to the backend", (path) => {
    expect(matches(proxy, path).length).toBeGreaterThan(0);
  });
});
