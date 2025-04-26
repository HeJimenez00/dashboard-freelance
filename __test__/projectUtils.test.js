import { calculateProgress, getProjectStatus } from "../utils/projectUtils";

describe("Utilidades para proyectos", () => {
  test("calculateProgress devuelve 0% para lista vacía", () => {
    expect(calculateProgress([])).toBe(0);
  });

  test("calculateProgress calcula correctamente el progreso", () => {
    const tasks = [
      { id: "1", text: "Tarea 1", completed: true },
      { id: "2", text: "Tarea 2", completed: false },
      { id: "3", text: "Tarea 3", completed: false },
      { id: "4", text: "Tarea 4", completed: true },
    ];

    expect(calculateProgress(tasks)).toBe(50);
  });

  test("getProjectStatus determina correctamente el estado del proyecto", () => {
    expect(getProjectStatus(0)).toBe("pending");
    expect(getProjectStatus(50)).toBe("in_progress");
    expect(getProjectStatus(100)).toBe("completed");
  });
});
