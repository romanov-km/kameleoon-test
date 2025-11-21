import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import type { ChartPoint, Variation } from "@/types/abTest";
import {
  formatDateShort,
  formatPercent,
  formatTooltipDate,
} from "@/utils/formatters";
import styles from "./ConversionChart.module.css";
import { CustomTooltip } from "./CustomTooltip";
import type { LineStyle } from "@/components/Controls/LineStyleSelector";

interface ConversionChartProps {
  points: ChartPoint[];
  variations: Variation[];
  lineStyle: LineStyle;
}

// преобразование ChartPoint в формат Recharts
function buildRechartsData(points: ChartPoint[], variations: Variation[]) {
  return points.map((point) => {
    const entry: Record<string, unknown> = {
      dateLabel: formatDateShort(point.date),
      dateFull: formatTooltipDate(point.date),
    };

    for (const variation of variations) {
      entry[variation.id] = point.values[variation.id] ?? null;
    }

    return entry;
  });
}

// домен по Y только по выбранным вариациям
function getYDomain(
  points: ChartPoint[],
  variations: Variation[]
): [number, number] {
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
    return [0, 100];
  }

  const padding = Math.max((max - min) * 0.1, 1);
  const domainMin = Math.max(0, Math.floor(min - padding));
  const domainMax = Math.min(100, Math.ceil(max + padding));

  if (domainMin === domainMax) {
    return [Math.max(0, domainMin - 1), Math.min(100, domainMax + 1)];
  }

  return [domainMin, domainMax];
}

const DEFAULT_COLORS = [
  "#4142EF",
  "#46464F",
  "#FF8346",
  "#DF57BC",
  "#35BDAD"
];

export const ConversionChart: React.FC<ConversionChartProps> = ({
  points,
  variations,
  lineStyle,
}) => {
  const chartData = buildRechartsData(points, variations);
  const [yMin, yMax] = getYDomain(points, variations);

  const commonAxes = (
    <>
      <CartesianGrid strokeDasharray="4 4" />
      <XAxis dataKey="dateLabel" />
      <YAxis
        domain={[yMin, yMax]}
        tickFormatter={(value) => formatPercent(value as number, 0)}
      />
      <Tooltip
        content={(props) => (
          <CustomTooltip {...props} variations={variations} />
        )}
        cursor={{ stroke: "#bdbdbd", strokeWidth: 1 }}
      />
    </>
  );

  // 3-й ряд на макете - Area
  if (lineStyle === "area") {
    return (
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 16, right: 24, bottom: 16, left: 8 }}
          >
            {commonAxes}
            {variations.map((variation, index) => (
              <Area
                key={variation.id}
                type="monotone"
                dataKey={variation.id}
                name={variation.name}
                stroke={DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                fill={DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                fillOpacity={0.18}
                strokeWidth={2}
                connectNulls={false}
                activeDot={{ r: 3 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // 4-й ряд на макете - Highlight: толстая прозрачная + тонкая линия
  if (lineStyle === "highlight") {
    return (
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 16, right: 24, bottom: 16, left: 8 }}
          >
            {commonAxes}
            {variations.map((variation, index) => {
              const color = DEFAULT_COLORS[index % DEFAULT_COLORS.length];

              return (
                <React.Fragment key={variation.id}>
                  <Line
                    type="monotone"
                    dataKey={variation.id}
                    name={variation.name}
                    dot={false}
                    strokeWidth={20}
                    stroke={color}
                    strokeOpacity={0.2}
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey={variation.id}
                    name={variation.name}
                    dot={false}
                    strokeWidth={2}
                    stroke={color}
                    connectNulls={false}
                  />
                </React.Fragment>
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // 1-й и 2-й ряды: smooth и linear
  const type: "linear" | "monotone" | "basis" =
    lineStyle === "linear"
      ? "linear"
      : "smooth"
      ? "basis" // более плавная кривая для Smooth
      : "monotone";

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 16, right: 24, bottom: 16, left: 8 }}
        >
          {commonAxes}
          {variations.map((variation, index) => (
            <Line
              key={variation.id}
              type={type}
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
