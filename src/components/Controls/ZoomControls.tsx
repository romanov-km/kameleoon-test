import styles from "./ZoomControls.module.css";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onToggleFullscreen?: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleFullscreen,
}) => {
  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.iconButton}
        onClick={onToggleFullscreen}
        title="Fullscreen"
      >
        ⤢
      </button>
      <button
        type="button"
        className={styles.iconButton}
        onClick={onZoomOut}
        title="Zoom out"
      >
        −
      </button>
      <button
        type="button"
        className={styles.iconButton}
        onClick={onZoomIn}
        title="Zoom in"
      >
        +
      </button>
      <button
        type="button"
        className={styles.iconButton}
        onClick={onReset}
        title="Reset zoom"
      >
        ↻
      </button>
    </div>
  );
};
