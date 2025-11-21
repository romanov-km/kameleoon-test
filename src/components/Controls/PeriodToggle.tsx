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
      <div className={styles.selectWrapper}>
        <select
          className={styles.select}
          value={value}
          onChange={(e) => onChange(e.target.value as Period)}
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
        </select>
        <span className={styles.chevron}>▾</span>
      </div>
    </div>
  );
};
