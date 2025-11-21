import { useMemo, useState } from "react";
import type { Variation } from "@/types/abTest";
import styles from "./VariationSelector.module.css";

interface VariationSelectorProps {
  variations: Variation[];
  selectedIds: string[];
  onChange: (nextSelected: string[]) => void;
}

export const VariationSelector: React.FC<VariationSelectorProps> = ({
  variations,
  selectedIds,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const label = useMemo(() => {
    if (selectedIds.length === variations.length) {
      return "All variations selected";
    }
    if (selectedIds.length === 1) {
      const v = variations.find((x) => x.id === selectedIds[0]);
      return v?.name ?? "1 variation selected";
    }
    return `${selectedIds.length} variations selected`;
  }, [selectedIds, variations]);

  const toggleCheck = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length === 1) {
        // нельзя снять последнюю
        return;
      }
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{label}</span>
        <span className={styles.chevron}>▾</span>
      </button>

      {open && (
        <div className={styles.menu}>
          {variations.map((variation) => {
            const checked = selectedIds.includes(variation.id);
            return (
              <label key={variation.id} className={styles.menuItem}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCheck(variation.id)}
                />
                <span>{variation.name}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};
