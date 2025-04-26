import React from "react";
import { render } from "@testing-library/react-native";
import PriorityTag from "../components/UI/PriorityTag";

describe("PriorityTag Component", () => {
  test("renders with alta priority correctly", () => {
    const { getByText } = render(<PriorityTag priority="Alta" />);

    expect(getByText("Alta")).toBeTruthy();
  });

  test("renders with media priority correctly", () => {
    const { getByText } = render(<PriorityTag priority="Media" />);

    expect(getByText("Media")).toBeTruthy();
  });

  test("renders with baja priority correctly", () => {
    const { getByText } = render(<PriorityTag priority="Baja" />);

    expect(getByText("Baja")).toBeTruthy();
  });
});
