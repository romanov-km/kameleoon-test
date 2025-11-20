import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { PreparedAbTestData } from "@/types/abTest";
import { formatPercent, formatDateShort } from "@/utils/formatters";
import styles from "./ConversionChart.module.css";
import { CustomTooltip } from "./CustomTooltip";

interface ConversionChartProps {
  data: PreparedAbTestData;
}

const CHART_HEIGHT = 320;

const DEFAULT_COLORS = [
  "#3366FF",
  "#FF6633",
  "#22AA99",
  "#FFCC33",
  "#AA3377",
  "#0099C6",
];

// Преобразуем наши ChartPoint в формат, удобный для Recharts
function buildRechartsData(prepared: PreparedAbTestData) {
  return prepared.dailyPoints.map((point) => {
    const base: Record<string, unknown> = {
      dateLabel: formatDateShort(point.date),
    };

    for (const [variationId, value] of Object.entries(point.values)) {
      base[variationId] = value;
    }

    return base;
  });
}

const ConversionChart: React.FC<ConversionChartProps> = ({ data }) => {
  const { variations } = data;
  const chartData = buildRechartsData(data);

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <LineChart data={chartData} margin={{ top: 16, right: 24, bottom: 16, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dateLabel" />
          <YAxis tickFormatter={(value) => formatPercent(value as number, 0)} />
          <Tooltip
            content={(props) => (
              <CustomTooltip {...props} variations={variations} />
            )}
          />
          <Legend />
          {variations.map((variation, index) => (
            <Line
              key={variation.id}
              type="monotone"
              dataKey={variation.id}
              name={variation.name}
              dot={false}
              strokeWidth={2}
              // цвет пока простой, потом можно подогнать под макет
              stroke={DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConversionChart;

