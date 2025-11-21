import type { TooltipContentProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
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

  const point = payload[0].payload as Record<string, unknown>;
  const dateText =
    (point.dateFull as string | undefined) ||
    (label as string | undefined) ||
    "";

  // определяем лучшую вариацию по значению в этой точке
  let bestId: string | null = null;
  let bestValue = -Infinity;

  for (const variation of variations) {
    const raw = point[variation.id] as number | null | undefined;
    if (raw != null && !Number.isNaN(raw) && raw > bestValue) {
      bestValue = raw;
      bestId = variation.id;
    }
  }

  return (
    <div className={styles.tooltip}>
      <div className={styles.header}>
        <div className={styles.calendarIcon} />
        <span className={styles.date}>{dateText}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.rows}>
        {variations.map((variation) => {
          const value = point[variation.id] as number | null | undefined;

          const plItem = payload.find((p) => p.dataKey === variation.id);
          const color = plItem?.color || "#999999";

          const isBest = bestId === variation.id;

          return (
            <div key={variation.id} className={styles.row}>
              <div className={styles.left}>
                <span
                  className={styles.dot}
                  style={{ backgroundColor: color }}
                />
                <span className={styles.variationName}>{variation.name}</span>
                {isBest && (
                  <span className={styles.trophy} title="Best variation">
                    🏆
                  </span>
                )}
              </div>
              <div className={styles.value}>{formatPercent(value, 2)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
