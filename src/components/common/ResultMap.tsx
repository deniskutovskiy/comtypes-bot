import styles from "./ResultMap.module.css";

export function ResultMap({ x, y }: { x: number; y: number }) {
  // Нормализуем координаты. Макс: 19, Мин: -19.
  // Нам нужно (-19..19) -> (-50%..50%)
  const xPercent = (x / 19) * 50;
  const yPercent = (y / 19) * 50;

  return (
    <div className={styles.mapWrapper}>
      <div className={styles.mapContainer}>
        {/* Оси */}
        <div className={`${styles.axis} ${styles.xAxis}`}></div>
        <div className={`${styles.axis} ${styles.yAxis}`}></div>

        {/* Лейблы */}
        <span className={`${styles.label} ${styles.top}`}>Неофициальный</span>
        <span className={`${styles.label} ${styles.bottom}`}>Официальный</span>
        <span className={`${styles.label} ${styles.left}`}>Активный</span>
        <span className={`${styles.label} ${styles.right}`}>Пассивный</span>

        {/* Точка пользователя */}
        <div
          className={styles.userDot}
          style={{
            transform: `translate(${xPercent}%, ${-yPercent}%)`, // Y-ось в CSS инвертирована
          }}
        />
      </div>
    </div>
  );
}
