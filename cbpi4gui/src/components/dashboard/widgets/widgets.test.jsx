import { describe, expect, it } from "vitest";
import { renderWithTheme, screen } from "../../../test-utils";
import { DashboardContext } from "../DashboardContext";
import { Text } from "./Text";

/**
 * Widgets read their model out of DashboardContext by id rather than taking it
 * as a prop, so the mock props go in through a stub provider.
 */
const renderWidget = (ui, elements) =>
  renderWithTheme(
    <DashboardContext.Provider
      value={{ state: { elements2: elements, draggable: false, selected: null }, actions: {} }}
    >
      {ui}
    </DashboardContext.Provider>
  );

describe("dashboard widgets", () => {
  it("renders a Text widget from its model", () => {
    renderWidget(<Text id="w1" />, [
      { id: "w1", name: "Mash Tun", props: { color: "#0f0", size: 20 } },
    ]);
    expect(screen.getByText("Mash Tun")).toBeInTheDocument();
  });

  it("applies the styling props from the model", () => {
    renderWidget(<Text id="w1" />, [
      { id: "w1", name: "Boil Kettle", props: { color: "rgb(255, 0, 0)", size: 32 } },
    ]);
    const el = screen.getByText("Boil Kettle");
    expect(el).toHaveStyle({ color: "rgb(255, 0, 0)", fontSize: "32px" });
  });

  it("renders without throwing when the model is missing", () => {
    // Widgets can outlive their model briefly while a dashboard reloads.
    expect(() => renderWidget(<Text id="does-not-exist" />, [])).not.toThrow();
  });
});
