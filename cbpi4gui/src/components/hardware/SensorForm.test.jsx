import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { mockAxios, renderWithProviders, screen, waitFor } from "../../test-utils";
import SensorForm from "./SensorForm";

describe("SensorForm", () => {
  beforeEach(async () => {
    await mockAxios();
  });

  it("renders the form", async () => {
    renderWithProviders(<SensorForm />, { route: "/sensor" });
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });
  });

  it("accepts typed input in the name field", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SensorForm />, { route: "/sensor" });

    const nameField = await screen.findByLabelText(/name/i);
    await user.type(nameField, "Mash Temp");

    expect(nameField).toHaveValue("Mash Temp");
  });

  it("keeps the field controlled across edits", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SensorForm />, { route: "/sensor" });

    const nameField = await screen.findByLabelText(/name/i);
    await user.type(nameField, "Boil");
    await user.clear(nameField);
    await user.type(nameField, "Sparge");

    expect(nameField).toHaveValue("Sparge");
  });
});
