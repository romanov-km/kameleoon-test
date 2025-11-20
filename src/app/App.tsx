import { useMemo, useState } from "react";
import rawData from "@/assets/data.json";
import { prepareAbTestData } from "@/utils/parseData";
import type { RawData } from "@/types/abTest";
import ConversionChart from "@/components/Chart/ConversionChart";
import { VariationSelector } from "@/components/Controls/VariationSelector";
import { PeriodToggle, type Period } from "@/components/Controls/PeriodToggle";
import styles from "./App.module.css";

const prepared = prepareAbTestData(rawData as RawData);

function App() {
  const [period, setPeriod] = useState<Period>("day");
  const [selectedVariations, setSelectedVariations] = useState<string[]>(() =>
    prepared.variations.map((v) => v.id)
  );

  const visibleVariations = useMemo(
    () => prepared.variations.filter((v) => selectedVariations.includes(v.id)),
    [selectedVariations]
  );

  const chartPoints = useMemo(
    () => (period === "day" ? prepared.dailyPoints : prepared.weeklyPoints),
    [period]
  );

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <h1 className={styles.title}>Conversion experiment chart</h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <VariationSelector
            variations={prepared.variations}
            selectedIds={selectedVariations}
            onChange={setSelectedVariations}
          />
          <PeriodToggle value={period} onChange={setPeriod} />
        </div>

        <ConversionChart points={chartPoints} variations={visibleVariations} />
      </div>
    </div>
  );
}

export default App;
