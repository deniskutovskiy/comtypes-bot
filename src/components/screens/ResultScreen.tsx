import React, { useState, useRef } from "react";
import { useAssessmentStore } from "../../store/useAssessmentStore";
import { typeDescriptions } from "../../data/descriptions";
import { ResultMap } from "../common/ResultMap";
import styles from "./ResultScreen.module.css";
import html2canvas from "html2canvas";

export function ResultScreen() {
  const result = useAssessmentStore((state) => state.result);
  const startAssessment = useAssessmentStore((state) => state.startAssessment);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const hiddenMapRef = useRef<HTMLDivElement>(null);

  if (!result) return null; // Защита

  const description = typeDescriptions[result.type];

  const handleRetake = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur(); // Remove focus after click
    setShowConfirmModal(true);
  };

  const confirmRetake = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur(); // Remove focus after click
    setShowConfirmModal(false);
    startAssessment();
  };

  const generateMapImage = async (): Promise<File | null> => {
    if (!hiddenMapRef.current) return null;

    try {
      const canvas = await html2canvas(hiddenMapRef.current, {
        backgroundColor: "#ffffff",
        scale: 2, // Higher quality
      });

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "result-map.png", { type: "image/png" });
            resolve(file);
          } else {
            resolve(null);
          }
        }, "image/png");
      });
    } catch (error) {
      console.error("Error generating map image:", error);
      return null;
    }
  };

  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur(); // Remove focus after click

    const appUrl = import.meta.env.VITE_MINI_APP_URL || window.location.href;
    const shareText = `Я прошел тест и узнал, что мой тип коммуникации — ${result.type}!\n\nПройди тест и узнай свой!\n${appUrl}`;

    // Generate map image
    const imageFile = await generateMapImage();

    if (navigator.share) {
      try {
        const shareData: ShareData = {
          text: shareText,
        };

        // Add image if generated and supported
        if (imageFile && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
          shareData.files = [imageFile];
        }

        await navigator.share(shareData);
      } catch {
        // User cancelled share
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert("Скопировано в буфер обмена!");
      } catch {
        alert("Не удалось скопировать");
      }
    }
  };

  const handleCancelModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur(); // Remove focus after click
    setShowConfirmModal(false);
  };

  return (
    <>
      {/* Hidden map for image generation */}
      <div
        ref={hiddenMapRef}
        style={{
          position: "absolute",
          left: "-9999px",
          width: "600px",
          height: "600px",
        }}
      >
        <ResultMap x={result.x} y={result.y} />
      </div>

      <div className={styles.resultContainer}>
        <h2>
          <span style={{ fontSize: 16, color: "#69f" }}>Ваш тип:</span>
          <br />
          {result.type}
        </h2>

        <div className={styles.mapSpoiler}>
          <button
            className={styles.mapToggleButton}
            onClick={() => setShowMap(!showMap)}
            aria-expanded={showMap}
            aria-controls="map-content"
          >
            <span>Визуализация</span>
            <span className={`${styles.mapToggleIcon} ${showMap ? styles.open : ""}`}>
              ▼
            </span>
          </button>
          <div
            id="map-content"
            className={`${styles.mapContent} ${showMap ? styles.mapContentVisible : styles.mapContentHidden}`}
          >
            <ResultMap x={result.x} y={result.y} />
          </div>
        </div>

        <div className={styles.descriptionText}>
          {description.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.retakeButton} onClick={handleRetake}>
            Пройти заново
          </button>
          <button className={styles.shareButton} onClick={handleShare}>
            📤 Поделиться
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "var(--z-modal)",
            backdropFilter: "blur(var(--blur-sm))",
            animation: "overlayFadeIn var(--transition-base)",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "var(--space-8)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-2xl)",
              maxWidth: "400px",
              width: "90%",
              animation: "fadeIn var(--transition-base)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "var(--space-4)" }}>
              Пройти тест заново?
            </h3>
            <p
              style={{
                marginBottom: "var(--space-6)",
                color: "var(--text-secondary)",
              }}
            >
              Ваши текущие результаты будут удалены. Вы уверены?
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--space-3)",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={handleCancelModal}
                style={{
                  background: "white",
                  color: "var(--text-secondary)",
                  border: "2px solid var(--border-medium)",
                }}
              >
                Отмена
              </button>
              <button
                onClick={confirmRetake}
                style={{
                  background: "var(--accent-primary)",
                  color: "white",
                }}
              >
                Да, начать заново
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
