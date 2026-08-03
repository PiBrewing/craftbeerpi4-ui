import { createTheme, ThemeProvider } from "@mui/material";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { AlertProvider } from "./components/alert/AlertProvider";
import { CBPiProvider } from "./components/data";

// A real GET /system/ payload, captured from cbpi 4.7.4. Using the genuine
// shape rather than a hand-written stub means these tests exercise the same
// data the components actually receive -- an approximated fixture hid a render
// error behind a shape the backend never returns.
import systemResponse from "./__fixtures__/system.json";

export { systemResponse };

/**
 * Stub axios so no test touches a real backend. Returns the mocked module so
 * individual tests can assert on calls or override a response.
 *
 * Pass a map of url-fragment -> payload to control specific endpoints.
 */
export async function mockAxios(overrides = {}) {
  const axios = (await import("axios")).default;
  const resolve = (url = "") => {
    for (const [fragment, payload] of Object.entries(overrides)) {
      if (url.includes(fragment)) return payload;
    }
    if (url.includes("/system")) return systemResponse;
    return [];
  };
  // configapi.getone reads a single config value over POST /config/<NAME>/ and
  // the caller renders the result directly, so this has to answer with the
  // scalar the backend returns rather than a generic object.
  const configValue = (url = "") => {
    const match = /\/config\/([^/]+)\/?$/.exec(url);
    if (!match) return null;
    const entry = systemResponse.config?.[match[1]];
    return entry?.value ?? "";
  };

  vi.spyOn(axios, "get").mockImplementation((url) =>
    Promise.resolve({ data: resolve(url), status: 200 })
  );
  vi.spyOn(axios, "post").mockImplementation((url) => {
    const value = configValue(url);
    return Promise.resolve({ data: value === null ? {} : value, status: 200 });
  });
  vi.spyOn(axios, "put").mockImplementation((url) =>
    Promise.resolve({ data: url?.includes("/config") ? systemResponse.config : {}, status: 200 })
  );
  vi.spyOn(axios, "delete").mockResolvedValue({ data: {}, status: 200 });
  return axios;
}

const theme = createTheme({ palette: { mode: "dark" } });

/**
 * Render inside the provider stack the app itself uses, minus the HashRouter --
 * tests use MemoryRouter so a route can be set per test.
 */
export function renderWithProviders(ui, { route = "/", ...options } = {}) {
  const Wrapper = ({ children }) => (
    <ThemeProvider theme={theme}>
      <AlertProvider>
        <CBPiProvider>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </CBPiProvider>
      </AlertProvider>
    </ThemeProvider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
}

/** Render with only a theme, for presentational components taking mock props. */
export function renderWithTheme(ui, options = {}) {
  const Wrapper = ({ children }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
}

export * from "@testing-library/react";
