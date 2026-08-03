import { describe, expect, it } from "vitest";

// Regression cover for the CRA -> Vite env swap. The app reads REACT_APP_*
// through import.meta.env with envPrefix set in vite.config.mjs; if that prefix
// is dropped the values silently become undefined and the websocket connects to
// "undefined" at runtime rather than failing the build.
describe("environment variables", () => {
  it("exposes REACT_APP_WEBSOCKET_URL via import.meta.env", () => {
    expect(import.meta.env.REACT_APP_WEBSOCKET_URL).toBeDefined();
    expect(import.meta.env.REACT_APP_WEBSOCKET_URL).toMatch(/^wss?:\/\/.+/);
  });

  it("provides the mode flags the app uses in place of NODE_ENV", () => {
    expect(typeof import.meta.env.DEV).toBe("boolean");
    expect(typeof import.meta.env.PROD).toBe("boolean");
    expect(import.meta.env.MODE).toBeTruthy();
  });
});
