import { formatDate } from "../utils/dateFormatter";

describe("Utilitario de fechas", () => {
  test("formatDate formatea correctamente la fecha", () => {
    const testDate = new Date(2025, 3, 15); // 15 de abril de 2025
    expect(formatDate(testDate)).toBe("15/Abril/2025");
  });

  test("formatDate maneja el último día del año", () => {
    const testDate = new Date(2025, 11, 31); // 31 de diciembre de 2025
    expect(formatDate(testDate)).toBe("31/Diciembre/2025");
  });

  test("formatDate maneja el primer día del año", () => {
    const testDate = new Date(2025, 0, 1); // 1 de enero de 2025
    expect(formatDate(testDate)).toBe("1/Enero/2025");
  });
});
