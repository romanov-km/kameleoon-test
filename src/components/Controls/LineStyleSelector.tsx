import { useState } from "react";
import styles from "./LineStyleSelector.module.css";

export type LineStyle = "smooth" | "linear" | "area" | "highlight";

interface LineStyleSelectorProps {
  value: LineStyle;
  onChange: (value: LineStyle) => void;
}

const OPTIONS: { value: LineStyle; label: string }[] = [
  { value: "linear", label: "line" },
  { value: "smooth", label: "smooth" },
  { value: "area", label: "area" },
  { value: "highlight", label: "highlight" },
];

export const LineStyleSelector: React.FC<LineStyleSelectorProps> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const current = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];

  const handleSelect = (val: LineStyle) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={styles.text}>
          Line style: <span className={styles.textValue}>{current.label}</span>
        </span>
        <span className={styles.chevron}>▾</span>
      </button>

      {open && (
        <div className={styles.menu}>
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.menuItem} ${
                opt.value === value ? styles.menuItemActive : ""
              }`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
