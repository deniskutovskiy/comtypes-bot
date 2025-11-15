import { useTelegram } from "../../hooks/useTelegram";
import { useAssessmentStore } from "../../store/useAssessmentStore";
import { part1Questions, part2Questions } from "../../data/questions";

export function AssessmentScreen() {
  const { webApp } = useTelegram();
  const index = useAssessmentStore((state) => state.currentQuestionIndex);
  const answerQuestion = useAssessmentStore((state) => state.answerQuestion);

  const isPart1 = index < 19;
  const currentQuestion = isPart1
    ? part1Questions[index]
    : part2Questions[index - 19];

  const progress = ((index + 1) / 38) * 100;

  return (
    <div className="assessment-container">
      <div className="progress-bar" style={{ width: `${progress}%` }} />
      <h3>Выберите одно из двух:</h3>
      <div className="button-pair">
        <button onClick={() => answerQuestion("left", webApp)}>
          {currentQuestion.left}
        </button>
        <button onClick={() => answerQuestion("right", webApp)}>
          {currentQuestion.right}
        </button>
      </div>
    </div>
  );
}
