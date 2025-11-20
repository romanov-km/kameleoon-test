import rawData from "@/assets/data.json";
import { prepareAbTestData } from "@/utils/ParseData";
import type { RawData } from "@/types/abTest";
import ConversionChart from "@/components/Chart/ConversionChart";
import styles from "./App.module.css";

const prepared = prepareAbTestData(rawData as RawData);

function App() {
  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <h1 className={styles.title}>Conversion experiment chart</h1>
        <ConversionChart data={prepared} />
      </div>
    </div>
  );
}

export default App;
