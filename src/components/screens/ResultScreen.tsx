import { useAssessmentStore } from "../../store/useAssessmentStore";
import { typeDescriptions } from "../../data/descriptions";
import { ResultMap } from "../common/ResultMap";

export function ResultScreen() {
  const result = useAssessmentStore((state) => state.result);
  const startAssessment = useAssessmentStore((state) => state.startAssessment);

  if (!result) return null; // Защита

  const description = typeDescriptions[result.type];

  return (
    <div className="result-container">
      <h2>Ваш тип: {result.type}</h2>

      <ResultMap x={result.x} y={result.y} />

      <div className="description-text">
        {description.split("\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <button className="retake-button" onClick={startAssessment}>
        Пройти заново
      </button>
    </div>
  );
}
