import styles from "./ThemeToggle.module.css";

export type Theme = "light" | "dark";

interface ThemeToggleProps {
  value: Theme;
  onChange: (value: Theme) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ value, onChange }) => {
  const isDark = value === "dark";

  return (
    <button
      type="button"
      className={`${styles.button} ${isDark ? styles.buttonDark : ""}`}
      onClick={() => onChange(isDark ? "light" : "dark")}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span className={styles.icon}>{isDark ? "🌙" : "☀️"}</span>
      <span className={styles.label}>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
};
