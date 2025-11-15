import { useAssessmentStore } from "../../store/useAssessmentStore";

export function WelcomeScreen() {
  const startAssessment = useAssessmentStore((state) => state.startAssessment);

  return (
    <div className="welcome-container">
      <h1>Анализ типов коммуникации</h1>
      <p>Узнайте свой коммуникационный стиль, ответив на 38 вопросов.</p>
      <button onClick={startAssessment}>Начать</button>
    </div>
  );
}
