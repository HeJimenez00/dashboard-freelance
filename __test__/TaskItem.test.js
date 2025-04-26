import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import TaskItem from "../components/UI/TaskItem";

describe("TaskItem Component", () => {
  test("renders task text correctly", () => {
    const { getByText } = render(
      <TaskItem
        task="Crear design system"
        completed={false}
        onToggle={() => {}}
      />,
    );

    expect(getByText("Crear design system")).toBeTruthy();
  });

  test("toggles checkbox when pressed", () => {
    const mockToggle = jest.fn();
    const { getByTestId } = render(
      <TaskItem
        task="Tarea de prueba"
        completed={false}
        onToggle={mockToggle}
      />,
    );

    const checkbox = getByTestId("task-checkbox");
    fireEvent.press(checkbox);

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
