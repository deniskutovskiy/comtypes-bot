import { create } from "zustand";
import { calculateResult, type AssessmentResult } from "../logic/calculator";
import type WebApp from "../lib/telegram"; // << 1. Импортируем нужный тип

type Choice = "left" | "right";

type AppStatus = "loading" | "idle" | "assessing" | "finished";

interface AssessmentState {
  status: AppStatus;
  currentQuestionIndex: number; // 0-37
  answers: { part1: Choice[]; part2: Choice[] };
  result: AssessmentResult | null;

  // Действия
  loadAssessmentFromCloud: (sdk: typeof WebApp) => void; // << 2. Заменяем 'any'
  startAssessment: () => void;
  answerQuestion: (choice: Choice, sdk: typeof WebApp) => void; // << 3. Заменяем 'any'
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  // Начальное состояние
  status: "loading",
  currentQuestionIndex: 0,
  answers: { part1: [], part2: [] },
  result: null,

  // Действие: Загрузка при старте
  loadAssessmentFromCloud: (webApp: typeof WebApp) => {
    // << 4. Типизируем аргумент
    webApp.CloudStorage.getItem("assessmentResult", (err, value) => {
      if (err || !value) {
        set({ status: "idle" });
        return;
      }
      try {
        const savedResult = JSON.parse(value) as AssessmentResult;
        set({ result: savedResult, status: "finished" });
      } catch (e) {
        console.error("Failed to parse saved result:", e);
        set({ status: "idle" });
      }
    });
  },

  // Действие: Начать / Перепройти
  startAssessment: () => {
    set({
      status: "assessing",
      currentQuestionIndex: 0,
      answers: { part1: [], part2: [] },
      result: null,
    });
  },

  // Действие: Ответ на вопрос
  answerQuestion: (choice: Choice, webApp: typeof WebApp) => {
    // << 5. Типизируем аргумент
    const { currentQuestionIndex, answers } = get();
    const totalQuestions = 38;

    webApp.HapticFeedback.impactOccurred("light");

    // 1. Сохраняем ответ
    const newAnswers = { ...answers };
    if (currentQuestionIndex < 19) {
      newAnswers.part1.push(choice);
    } else {
      newAnswers.part2.push(choice);
    }

    // 2. Проверяем, не последний ли это вопрос
    if (currentQuestionIndex < totalQuestions - 1) {
      // Переходим к следующему вопросу
      set({
        answers: newAnswers,
        currentQuestionIndex: currentQuestionIndex + 1,
      });
    } else {
      // 3. Анализ закончен: вычисляем и сохраняем
      const finalResult = calculateResult(newAnswers);

      webApp.CloudStorage.setItem(
        "assessmentResult",
        JSON.stringify(finalResult),
        (err) => {
          // << 6. (BONUS) Добавляем обработку ошибки сохранения
          if (err) {
            console.error("Failed to save result to CloudStorage:", err);
            // TODO: Решить, как обработать ошибку.
            // Показать пользователю "Ошибка сохранения" или просто
            // показать результат без сохранения?
            // Для MVP покажем результат в любом случае.
          }
          // Показываем результат
          set({
            result: finalResult,
            status: "finished",
            answers: newAnswers,
          });
        }
      );
    }
  },
}));
