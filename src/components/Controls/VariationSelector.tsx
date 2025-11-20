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
  const handleToggle = (id: string) => {
    onChange(
      selectedIds.includes(id)
        ? // не даем снять последнюю вариацию
          selectedIds.length === 1
          ? selectedIds
          : selectedIds.filter((v) => v !== id)
        : [...selectedIds, id]
    );
  };

  return (
    <div className={styles.wrapper}>
      {variations.map((variation) => {
        const checked = selectedIds.includes(variation.id);

        return (
          <label key={variation.id} className={styles.item}>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => handleToggle(variation.id)}
              className={styles.checkbox}
            />
            <span className={styles.label}>{variation.name}</span>
          </label>
        );
      })}
    </div>
  );
};
