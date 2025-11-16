import React from "react";
import styles from "./InstructionsModal.module.css";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <h2>Как проходить тест</h2>

        <div className={styles.instructions}>
          <ul>
            <li>Выберите один из двух вариантов</li>
            <li>
              Отвечайте первое, что приходит{" "}
              <span style={{ whiteSpace: "nowrap" }}>в голову</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
