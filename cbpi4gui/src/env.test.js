import { describe, expect, it } from "vitest";

// Regression cover for the CRA -> Vite env swap: the app reads the mode through
// import.meta.env rather than process.env.NODE_ENV.
describe("environment variables", () => {
  it("provides the mode flags the app uses in place of NODE_ENV", () => {
    expect(typeof import.meta.env.DEV).toBe("boolean");
    expect(typeof import.meta.env.PROD).toBe("boolean");
    expect(import.meta.env.MODE).toBeTruthy();
  });
});
