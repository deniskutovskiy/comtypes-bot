import type { typeDescriptions } from "../data/descriptions";

// Тип для наших ответов
type Choice = "left" | "right";

// Тип для итогового результата
export type AssessmentResult = {
  x: number;
  y: number;
  type: keyof typeof typeDescriptions;
};

export function calculateResult(answers: {
  part1: Choice[];
  part2: Choice[];
}): AssessmentResult {
  // Ось Y (Официальный/Неофициальный)
  const y = answers.part1.reduce(
    (acc, choice) => acc + (choice === "left" ? -1 : 1),
    0
  );

  // Ось X (Активный/Пассивный)
  const x = answers.part2.reduce(
    (acc, choice) => acc + (choice === "left" ? 1 : -1),
    0
  );

  // Определение типа
  let type: keyof typeof typeDescriptions;
  if (x > 0 && y < 0) type = "ANALYZING";
  else if (x < 0 && y < 0) type = "DRIVING";
  else if (x > 0 && y > 0) type = "SUPPORTING";
  else type = "PROMOTING";

  return { x, y, type };
}
