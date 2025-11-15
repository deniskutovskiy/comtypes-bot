import styles from "./Spinner.module.css";

export function Spinner() {
  return (
    <div className={styles.spinnerOverlay}>
      <div className={styles.spinnerLoader} />
    </div>
  );
}
