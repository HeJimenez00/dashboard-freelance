import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import StatusSelector from "../components/UI/StatusSelector";

describe("StatusSelector Component", () => {
  test("renders all status options", () => {
    const { getByText } = render(
      <StatusSelector currentStatus="pending" onStatusChange={() => {}} />,
    );

    expect(getByText("Por hacer")).toBeTruthy();
    expect(getByText("En progreso")).toBeTruthy();
    expect(getByText("Terminado")).toBeTruthy();
  });

  test("calls onStatusChange when a status is selected", () => {
    const mockOnStatusChange = jest.fn();
    const { getByText } = render(
      <StatusSelector
        currentStatus="pending"
        onStatusChange={mockOnStatusChange}
      />,
    );

    fireEvent.press(getByText("En progreso"));

    expect(mockOnStatusChange).toHaveBeenCalledWith("in_progress");
  });
});
