import React, { useEffect, useState } from "react";
import { useTelegram } from "../../hooks/useTelegram";
import { useAssessmentStore } from "../../store/useAssessmentStore";
import { part1Questions, part2Questions } from "../../data/questions";
import { InstructionsModal } from "../InstructionsModal/InstructionsModal";
import styles from "./AssessmentScreen.module.css";

export function AssessmentScreen() {
  const { webApp } = useTelegram();
  const index = useAssessmentStore((state) => state.currentQuestionIndex);
  const answerQuestion = useAssessmentStore((state) => state.answerQuestion);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isPart1 = index < 19;
  const currentQuestion = isPart1
    ? part1Questions[index]
    : part2Questions[index - 19];

  const progress = ((index + 1) / 38) * 100;

  // Remove focus from buttons when question changes
  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [index]);

  const handleAnswer = (
    side: "left" | "right",
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.currentTarget.blur(); // Remove focus after click
    answerQuestion(side, webApp);
  };

  return (
    <div className={styles.assessmentContainer}>
      {/* Help button */}
      <button
        className={styles.helpButton}
        onClick={() => setIsModalOpen(true)}
        aria-label="Показать инструкции"
      >
        ?
      </button>

      {/* Progress bar */}
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>

      {/* Question number */}
      <div className={styles.questionNumber}>{index + 1} из 38</div>

      <h3>Выберите одно из двух понятий, которое больше вас характеризует:</h3>

      <div className={styles.buttonPair}>
        <button onClick={(e) => handleAnswer("left", e)}>
          {currentQuestion.left}
        </button>
        <button onClick={(e) => handleAnswer("right", e)}>
          {currentQuestion.right}
        </button>
      </div>

      <InstructionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
