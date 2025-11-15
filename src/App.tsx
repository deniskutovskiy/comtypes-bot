import { Spinner } from "./components/common/Spinner";
import { AssessmentScreen } from "./components/screens/AssessmentScreen";
import { ResultScreen } from "./components/screens/ResultScreen";
import { WelcomeScreen } from "./components/screens/WelcomeScreen";
import { useTelegram } from "./hooks/useTelegram";
import { useAssessmentStore } from "./store/useAssessmentStore";
import { useEffect } from "react";

function App() {
  const { webApp } = useTelegram();
  const status = useAssessmentStore((state) => state.status);
  const loadAssessmentFromCloud = useAssessmentStore(
    (state) => state.loadAssessmentFromCloud
  );

  // При первой загрузке пытаемся получить данные
  useEffect(() => {
    if (status === "loading") {
      loadAssessmentFromCloud(webApp);
    }
  }, [status, loadAssessmentFromCloud, webApp]);

  // "Маршрутизация" на основе состояния
  if (status === "loading") return <Spinner />;
  if (status === "finished") return <ResultScreen />;
  if (status === "assessing") return <AssessmentScreen />; // << Изменено

  // status === 'idle'
  return <WelcomeScreen />;
}

export default App;
