export type VariationId = string; //

export interface RawVariation {
  id?: number;
  name: string;
}

export interface RawRow {
  date: string;
  visits: Record<string, number>;
  conversions: Record<string, number>;
}

export interface RawData {
  variations: RawVariation[];
  data: RawRow[];
}

export interface Variation {
  id: VariationId;
  name: string;
}

export interface ChartPoint {
  date: Date; // настоящая дата
  dateLabel: string; // подпись оси в тултипе
  values: Record<VariationId, number | null>; // проценты по вариациям, если нет данных то null
}

// Полность подготовленнные данные для приложения
export interface PreparedAbTestData {
  variations: Variation[];
  dailyPoints: ChartPoint[];
  weeklyPoints: ChartPoint[];
}
