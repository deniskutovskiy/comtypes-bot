import React from "react";
import styles from "./ResultMap.module.css";

export function ResultMap({ x, y }: { x: number; y: number }) {
  // Нормализуем координаты. Макс: 19, Мин: -19.
  // Нам нужно (-19..19) -> (-45%..45%) для отступов по краям
  const xPercent = (x / 19) * 45;
  const yPercent = (y / 19) * 45;

  // Значения рисок на осях
  const riskValues = [5, 10, 15, 20];

  return (
    <div className={styles.mapWrapper}>
      <div className={styles.mapContainer}>
        {/* Оси */}
        <div className={`${styles.axis} ${styles.xAxis}`}></div>
        <div className={`${styles.axis} ${styles.yAxis}`}></div>

        {/* Риски на осях */}
        {riskValues.map((value) => {
          const position = (value / 19) * 45; // позиция в процентах от центра
          return (
            <React.Fragment key={value}>
              {/* Точка на правой оси X */}
              <div
                className={styles.riskDot}
                style={{ left: `${50 + position}%`, top: "50%" }}
              />
              <span
                className={`${styles.riskLabel} ${styles.horizontal}`}
                style={{ left: `${50 + position}%`, top: "50%" }}
              >
                {value}
              </span>

              {/* Точка на левой оси X */}
              <div
                className={styles.riskDot}
                style={{ left: `${50 - position}%`, top: "50%" }}
              />
              <span
                className={`${styles.riskLabel} ${styles.horizontal}`}
                style={{ left: `${50 - position}%`, top: "50%" }}
              >
                {-value}
              </span>

              {/* Точка на верхней оси Y */}
              <div
                className={styles.riskDot}
                style={{ left: "50%", top: `${50 - position}%` }}
              />
              <span
                className={`${styles.riskLabel} ${styles.vertical}`}
                style={{ left: "50%", top: `${50 - position}%` }}
              >
                {value}
              </span>

              {/* Точка на нижней оси Y */}
              <div
                className={styles.riskDot}
                style={{ left: "50%", top: `${50 + position}%` }}
              />
              <span
                className={`${styles.riskLabel} ${styles.vertical}`}
                style={{ left: "50%", top: `${50 + position}%` }}
              >
                {-value}
              </span>
            </React.Fragment>
          );
        })}

        {/* Лейблы */}
        <span className={`${styles.label} ${styles.top}`}>Неофициальный</span>
        <span className={`${styles.label} ${styles.bottom}`}>Официальный</span>
        <span className={`${styles.label} ${styles.left}`}>Активный</span>
        <span className={`${styles.label} ${styles.right}`}>Пассивный</span>

        {/* Точка пользователя */}
        <div
          className={styles.userDot}
          style={{
            left: `${50 + xPercent}%`,
            top: `${50 - yPercent}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </div>
  );
}
