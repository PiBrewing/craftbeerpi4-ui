// jest-dom adds custom matchers for asserting on DOM nodes, e.g.
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { vi } from "vitest";

// MUI's useMediaQuery and responsive helpers call matchMedia, which jsdom
// does not implement.
vi.stubGlobal(
  "matchMedia",
  vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
);

// Used by the dashboard's SVG layout code.
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// jsdom implements neither, and the alert provider builds an Audio element
// for the buzzer on mount.
window.HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
window.HTMLMediaElement.prototype.pause = vi.fn();

// Plotly probes for a 2D context on import. jsdom cannot provide one without
// the native canvas package, and the resulting "Not implemented" noise buries
// real failures. Charts are covered by the integration checklist, not here.
window.HTMLCanvasElement.prototype.getContext = vi.fn(() => null);

// jsdom has no SVG layout engine. The dashboard measures its elements with
// getBBox/getScreenCTM to place widgets, so both need stubbing or the
// dashboard throws on mount.
window.SVGElement.prototype.getBBox = vi.fn(() => ({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
}));
window.SVGElement.prototype.getScreenCTM = vi.fn(() => ({
  a: 1,
  b: 0,
  c: 0,
  d: 1,
  e: 0,
  f: 0,
  inverse() {
    return this;
  },
  multiply() {
    return this;
  },
}));
window.SVGSVGElement.prototype.createSVGPoint = vi.fn(() => ({
  x: 0,
  y: 0,
  matrixTransform() {
    return { x: 0, y: 0 };
  },
}));
