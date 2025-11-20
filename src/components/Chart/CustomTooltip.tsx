import type { TooltipContentProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { Variation } from "@/types/abTest";
import { formatPercent } from "@/utils/formatters";
import styles from "./CustomTooltip.module.css";

interface CustomTooltipProps extends TooltipContentProps<ValueType, NameType> {
  variations: Variation[];
}

export const CustomTooltip: React.FC<CustomTooltipProps> = (props) => {
  const { active, payload, label, variations } = props;

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  // payload[0].payload содержит весь объект точки
  const point = payload[0].payload as Record<string, unknown>;

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipHeader}>{label}</div>
      <div className={styles.tooltipBody}>
        {variations.map((variation) => {
          const value = point[variation.id] as number | null | undefined;

          // Ищем цвет линии из payload
          const plItem = payload.find((p) => p.dataKey === variation.id);
          const color = plItem?.color;

          return (
            <div key={variation.id} className={styles.tooltipRow}>
              <span className={styles.legendDot} style={{ backgroundColor: color }} />
              <span className={styles.variationName}>{variation.name}:</span>
              <span className={styles.value}>{formatPercent(value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
