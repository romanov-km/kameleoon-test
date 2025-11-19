import './App.css';
import '../index.css';
import { prepareAbTestData } from '@/utils/ParseData';
import type { RawData } from '@/types/abTest';
import rawData from "@/assets/data.json";

function App() {
  const prepared = prepareAbTestData(rawData as RawData);

  console.log("prepared", prepared);

  return (
    <>
    <div>
      Conversion expirement chart
    </div>
    </>
  )
}

export default App
