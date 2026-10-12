import { createTheme, ThemeProvider } from "@mui/material";
import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";
import { AlertProvider } from "./components/alert/AlertProvider";
import { CBPiProvider } from "./components/data";
import { mockAxios } from "./test-utils";

// App brings its own HashRouter, so it gets the provider stack from index.jsx
// rather than the MemoryRouter helper in test-utils.
const renderApp = () => {
  const theme = createTheme({ palette: { mode: "dark" } });
  return render(
    <ThemeProvider theme={theme}>
      <AlertProvider>
        <CBPiProvider>
          <App />
        </CBPiProvider>
      </AlertProvider>
    </ThemeProvider>
  );
};

describe("App", () => {
  beforeEach(async () => {
    await mockAxios();
    window.location.hash = "#/";
  });

  it("renders without throwing", () => {
    expect(() => renderApp()).not.toThrow();
  });

  it("mounts the app shell", async () => {
    renderApp();
    // The brewery name comes from config, so assert on persistent chrome
    // instead -- the header bar is always present.
    await waitFor(() => {
      expect(document.querySelector("header")).toBeInTheDocument();
    });
  });

  it("mounts the dashboard at the index route", async () => {
    const { container } = renderApp();
    // The dashboard draws its layout onto an svg surface once mounted.
    await waitFor(() => {
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  it("renders a non-index route without throwing", async () => {
    window.location.hash = "#/about";
    expect(() => renderApp()).not.toThrow();
    await waitFor(() => {
      expect(document.querySelector("header")).toBeInTheDocument();
    });
  });
});
