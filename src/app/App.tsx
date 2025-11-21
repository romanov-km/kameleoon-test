import { useMemo, useRef, useState } from "react";
import rawData from "@/assets/data.json";
import { prepareAbTestData } from "@/utils/parseData";
import type { RawData } from "@/types/abTest";
import { ConversionChart } from "@/components/Chart/ConversionChart";
import { VariationSelector } from "@/components/Controls/VariationSelector";
import { PeriodToggle, type Period } from "@/components/Controls/PeriodToggle";
import {
  LineStyleSelector,
  type LineStyle,
} from "@/components/Controls/LineStyleSelector";
import { ZoomControls } from "@/components/Controls/ZoomControls";
import styles from "./App.module.css";
import { ThemeToggle, type Theme } from "@/components/Controls/ThemeToggle";
import * as htmlToImage from "html-to-image";

const prepared = prepareAbTestData(rawData as RawData);

function App() {
  const [period, setPeriod] = useState<Period>("day");
  const [lineStyle, setLineStyle] = useState<LineStyle>("smooth");
  const [selectedVariations, setSelectedVariations] = useState<string[]>(() =>
    prepared.variations.map((v) => v.id)
  );
  const [xRange, setXRange] = useState<[number, number] | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  const chartRef = useRef<HTMLDivElement | null>(null);

  const basePoints = useMemo(
    () => (period === "day" ? prepared.dailyPoints : prepared.weeklyPoints),
    [period]
  );

  const chartPoints = useMemo(() => {
    if (!xRange) {
      return basePoints;
    }
    const [start, end] = xRange;
    return basePoints.slice(start, end + 1);
  }, [basePoints, xRange]);

  const visibleVariations = useMemo(
    () => prepared.variations.filter((v) => selectedVariations.includes(v.id)),
    [selectedVariations]
  );

  const handleExportPng = async () => {
    if (!chartRef.current) return;
  
    try {
      const dataUrl = await htmlToImage.toPng(chartRef.current, {
        backgroundColor: theme === "dark" ? "#303134" : "#ffffff",
      });
  
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `conversion-chart-${period}.png`;
      link.click();
    } catch (e) {
      // можно вывести console.error, но для тестового достаточно тихо
      console.error("Export failed", e);
    }
  };

  // zoom helpers
  const resetZoom = () => setXRange(null);

  const zoomIn = () => {
    const len = basePoints.length;
    if (len <= 4) return;

    const current = xRange ?? [0, len - 1];
    const currentLen = current[1] - current[0] + 1;
    if (currentLen <= 4) return;

    const nextLen = Math.max(4, Math.floor(currentLen * 0.7));
    const center = (current[0] + current[1]) / 2;

    let start = Math.round(center - nextLen / 2);
    let end = start + nextLen - 1;

    if (start < 0) {
      start = 0;
      end = nextLen - 1;
    }
    if (end >= len) {
      end = len - 1;
      start = end - nextLen + 1;
    }

    setXRange([start, end]);
  };

  const zoomOut = () => {
    const len = basePoints.length;
    if (len <= 1) return;

    const current = xRange ?? [0, len - 1];
    const currentLen = current[1] - current[0] + 1;

    if (currentLen >= len) {
      setXRange(null);
      return;
    }

    const nextLen = Math.min(len, Math.ceil(currentLen * 1.3));
    const center = (current[0] + current[1]) / 2;

    let start = Math.round(center - nextLen / 2);
    let end = start + nextLen - 1;

    if (start < 0) {
      start = 0;
      end = nextLen - 1;
    }
    if (end >= len) {
      end = len - 1;
      start = end - nextLen + 1;
    }

    if (nextLen === len) {
      setXRange(null);
    } else {
      setXRange([start, end]);
    }
  };

  const toggleFullscreen = () => {
    setFullscreen((prev) => !prev);
  };

  // сбрасываем zoom при смене периода
  const handlePeriodChange = (next: Period) => {
    setPeriod(next);
    setXRange(null);
  };

  return (
    <div className={`${styles.app} ${fullscreen ? styles.appFullscreen : ""}`}>
      <div
        className={`${styles.container} ${
          fullscreen ? styles.containerFullscreen : ""
        }`}
      >
        <div className={styles.topBar}>
          <div className={styles.topLeft}>
            <VariationSelector
              variations={prepared.variations}
              selectedIds={selectedVariations}
              onChange={setSelectedVariations}
            />
            <PeriodToggle value={period} onChange={handlePeriodChange} />
          </div>
          <div className={styles.topRight}>
            <ThemeToggle value={theme} onChange={setTheme} />
            <LineStyleSelector value={lineStyle} onChange={setLineStyle} />
            <ZoomControls
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onReset={resetZoom}
              onToggleFullscreen={toggleFullscreen}
              onExport={handleExportPng}
            />
          </div>
        </div>

        <div ref={chartRef} className={styles.chartSection}>
          <ConversionChart
            points={chartPoints}
            variations={visibleVariations}
            lineStyle={lineStyle}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
