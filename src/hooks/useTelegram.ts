import { useEffect } from "react";
import WebApp from "../lib/telegram";

export function useTelegram() {
  // SDK инициализируется один раз при старте
  useEffect(() => {
    WebApp.ready();
    WebApp.expand(); // Разворачиваем приложение на весь экран
  }, []);

  return {
    webApp: WebApp,
    user: WebApp.initDataUnsafe?.user,
  };
}
