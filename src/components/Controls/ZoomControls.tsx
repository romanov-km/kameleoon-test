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
        className={styles.fullscreen}
        onClick={onToggleFullscreen}
        title="Fullscreen"
      >
        ⛶
      </button>

      <div className={styles.zoomGroup}>
        <button
          type="button"
          className={`${styles.zoomBtn} ${styles.zoomMinus}`}
          onClick={onZoomOut}
          title="Zoom out"
        >
          −
        </button>
        <button
          type="button"
          className={`${styles.zoomBtn} ${styles.zoomPlus}`}
          onClick={onZoomIn}
          title="Zoom in"
        >
          +
        </button>
      </div>

      <button
        type="button"
        className={styles.reset}
        onClick={onReset}
        title="Reset zoom"
      >
        ↻
      </button>
    </div>
  );
};
