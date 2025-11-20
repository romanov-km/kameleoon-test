import styles from "./PeriodToggle.module.css";

export type Period = "day" | "week";

interface PeriodToggleProps {
  value: Period;
  onChange: (value: Period) => void;
}

export const PeriodToggle: React.FC<PeriodToggleProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={`${styles.button} ${
          value === "day" ? styles.buttonActive : ""
        }`}
        onClick={() => onChange("day")}
      >
        Day
      </button>
      <button
        type="button"
        className={`${styles.button} ${
          value === "week" ? styles.buttonActive : ""
        }`}
        onClick={() => onChange("week")}
      >
        Week
      </button>
    </div>
  );
};
