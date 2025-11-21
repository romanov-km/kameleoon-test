import styles from "./LineStyleSelector.module.css";

export type LineStyle = "line" | "smooth" | "area";

interface LineStyleSelectorProps {
  value: LineStyle;
  onChange: (value: LineStyle) => void;
}

const OPTIONS: { value: LineStyle; label: string }[] = [
  { value: "line", label: "line" },
  { value: "smooth", label: "smooth" },
  { value: "area", label: "area" },
];

export const LineStyleSelector: React.FC<LineStyleSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Line style:</span>
      <div className={styles.selectWrapper}>
        <select
          className={styles.select}
          value={value}
          onChange={(e) => onChange(e.target.value as LineStyle)}
        >
          {OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={styles.chevron}>▾</span>
      </div>
    </div>
  );
};
