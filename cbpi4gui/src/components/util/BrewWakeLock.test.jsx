import { render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CBPiContext } from "../data";
import BrewWakeLock from "./BrewWakeLock";

const withSteps = (statuses, fermenterStatuses = []) => (
  <CBPiContext.Provider
    value={{
      state: {
        mashProfile: statuses.map((status) => ({ status })),
        fermentersteps: [{ id: "f1", steps: fermenterStatuses.map((status) => ({ status })) }],
      },
      actions: {},
    }}
  >
    <BrewWakeLock />
  </CBPiContext.Provider>
);

describe("BrewWakeLock", () => {
  let sentinel;

  beforeEach(() => {
    sentinel = { released: false, release: vi.fn(() => (sentinel.released = true)) };
    navigator.wakeLock = { request: vi.fn(() => Promise.resolve(sentinel)) };
  });

  afterEach(() => {
    delete navigator.wakeLock;
  });

  it("does not lock the screen outside a brew", () => {
    render(withSteps(["I", "D"]));
    expect(navigator.wakeLock.request).not.toHaveBeenCalled();
  });

  it.each(["A", "S", "E"])("locks the screen while a step is %s", (status) => {
    render(withSteps(["D", status, "I"]));
    expect(navigator.wakeLock.request).toHaveBeenCalledWith("screen");
  });

  it("does not lock the screen for fermenter steps", () => {
    render(withSteps(["I", "D"], ["A", "S", "E"]));
    expect(navigator.wakeLock.request).not.toHaveBeenCalled();
  });

  it("releases the lock once the brew is over", async () => {
    const { rerender } = render(withSteps(["A"]));
    await waitFor(() => expect(navigator.wakeLock.request).toHaveBeenCalledTimes(1));
    await Promise.resolve();
    rerender(withSteps(["D"]));
    expect(sentinel.release).toHaveBeenCalled();
  });

  it("does nothing when the browser has no wake lock", () => {
    delete navigator.wakeLock;
    expect(() => render(withSteps(["A"]))).not.toThrow();
  });
});
