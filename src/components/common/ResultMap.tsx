export function ResultMap({ x, y }: { x: number; y: number }) {
  // Нормализуем координаты. Макс: 19, Мин: -19.
  // Нам нужно (-19..19) -> (-50%..50%)
  const xPercent = (x / 19) * 50;
  const yPercent = (y / 19) * 50;

  return (
    <div className="map-container">
      {/* Оси */}
      <div className="axis x-axis"></div>
      <div className="axis y-axis"></div>

      {/* Лейблы */}
      <span className="label top">НЕОФИЦИАЛЬНЫЙ</span>
      <span className="label bottom">ОФИЦИАЛЬНЫЙ</span>
      <span className="label left">АКТИВНЫЙ</span>
      <span className="label right">ПАССИВНЫЙ</span>

      {/* Точка пользователя */}
      <div
        className="user-dot"
        style={{
          transform: `translate(${xPercent}%, ${-yPercent}%)`, // Y-ось в CSS инвертирована
        }}
      />
    </div>
  );
}
