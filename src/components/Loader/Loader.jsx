import styles from "./Loader.module.scss"

export default function Loader() {
  return (
    <div
      className={styles.loader}>
      <div className={styles.simpleSpinner}>
        <span></span>
      </div>
    </div>
  );
}