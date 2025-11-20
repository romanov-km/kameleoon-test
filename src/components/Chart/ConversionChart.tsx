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
  import type { ChartPoint, Variation } from "@/types/abTest";
  import { formatPercent } from "@/utils/formatters";
  import styles from "./ConversionChart.module.css";
  import { CustomTooltip } from "./CustomTooltip";
  
  interface ConversionChartProps {
    points: ChartPoint[];
    variations: Variation[];
  }
  
  // Преобразуем ChartPoint в формат Recharts
  function buildRechartsData(points: ChartPoint[], variations: Variation[]) {
    return points.map((point) => {
      const entry: Record<string, unknown> = {
        dateLabel: point.dateLabel || point.date.toISOString().slice(0, 10),
      };
  
      for (const variation of variations) {
        entry[variation.id] = point.values[variation.id] ?? null;
      }
  
      return entry;
    });
  }
  
  // Считаем min/max по Y только для выбранных вариаций
  function getYDomain(points: ChartPoint[], variations: Variation[]): [number, number] {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
  
    for (const point of points) {
      for (const variation of variations) {
        const value = point.values[variation.id];
        if (value != null && !Number.isNaN(value)) {
          if (value < min) min = value;
          if (value > max) max = value;
        }
      }
    }
  
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      // fallback если нет данных
      return [0, 100];
    }
  
    // небольшой отступ сверху и снизу
    const padding = Math.max((max - min) * 0.1, 1);
    const domainMin = Math.max(0, Math.floor(min - padding));
    const domainMax = Math.min(100, Math.ceil(max + padding));
  
    if (domainMin === domainMax) {
      return [Math.max(0, domainMin - 1), Math.min(100, domainMax + 1)];
    }
  
    return [domainMin, domainMax];
  }
  
  const DEFAULT_COLORS = [
    "#3366FF",
    "#FF6633",
    "#22AA99",
    "#FFCC33",
    "#AA3377",
    "#0099C6",
  ];
  
  const ConversionChart: React.FC<ConversionChartProps> = ({ points, variations }) => {
    const chartData = buildRechartsData(points, variations);
    const [yMin, yMax] = getYDomain(points, variations);
  
    return (
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 16, right: 24, bottom: 16, left: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dateLabel" />
            <YAxis
              domain={[yMin, yMax]}
              tickFormatter={(value) => formatPercent(value as number, 0)}
            />
            <Tooltip
              content={(props) => (<CustomTooltip {...props} variations={variations} />)}
              cursor={{ stroke: "#9e9e9e", strokeWidth: 1 }}
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
  