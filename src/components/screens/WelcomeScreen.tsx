import React from "react";
import { useAssessmentStore } from "../../store/useAssessmentStore";
import styles from "./WelcomeScreen.module.css";

export function WelcomeScreen() {
  const startAssessment = useAssessmentStore((state) => state.startAssessment);

  const handleStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur(); // Remove focus after click
    startAssessment();
  };

  return (
    <div className={styles.welcomeContainer}>
      <h1>Анализ типов коммуникации</h1>

      <p>
        Узнайте свой коммуникационный стиль{" "}
        <span style={{ whiteSpace: "nowrap" }}>и поймите,</span> как вы
        взаимодействуете{" "}
        <span style={{ whiteSpace: "nowrap" }}>с окружающими.</span>
      </p>

      <div className={styles.instructions}>
        <strong>Как проходить:</strong>
        <ul>
          <li>
            Вам будет предложено{" "}
            <span style={{ whiteSpace: "nowrap" }}>38 вопросов</span>
          </li>
          <li>Выберите один из двух вариантов</li>
          <li>
            Отвечайте честно, первое, что приходит{" "}
            <span style={{ whiteSpace: "nowrap" }}>в голову</span>
          </li>
          <li>
            Тест займет около{" "}
            <span style={{ whiteSpace: "nowrap" }}>5-7 минут</span>
          </li>
        </ul>
      </div>

      <button onClick={handleStart}>Начать тестирование</button>
    </div>
  );
}
