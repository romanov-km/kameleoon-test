import type {
  ChartPoint,
  PreparedAbTestData,
  RawData,
  Variation,
  VariationId,
} from "@/types/abTest";

const DAY_MS = 24 * 60 * 60 * 1000;

// Нормализация списка вариаций
function normalizeVariations(raw: RawData): Variation[] {
  return raw.variations.map((v, index) => {
    // В data.json у Original нет id, а в visits/conversions он под ключом "0"
    const id = v.id !== undefined ? String(v.id) : "0";

    return {
      id,
      name: v.name,
    };
  });
}

// Дневные точки
function buildDailyPoints(raw: RawData, variations: Variation[]): ChartPoint[] {
  return raw.data
    .map((row) => {
      const date = new Date(row.date + "T00:00:00Z");

      const values: Record<VariationId, number | null> = {};

      for (const variation of variations) {
        const varId = variation.id;
        const visits = row.visits[varId];
        const conversions = row.conversions[varId];

        if (visits != null && visits > 0 && conversions != null) {
          const rate = (conversions / visits) * 100;
          values[varId] = rate;
        } else {
          // нет данных или 0 визитов - ставим null, чтобы график делал разрыв
          values[varId] = null;
        }
      }

      return {
        date,
        dateLabel: row.date, // позже можно заменить форматирование
        values,
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

// Недельные точки: считаем Week 1, Week 2... от первой даты
function buildWeeklyPoints(
  raw: RawData,
  variations: Variation[]
): ChartPoint[] {
  if (!raw.data.length) return [];

  const sortedRows = [...raw.data].sort((a, b) => a.date.localeCompare(b.date));

  const firstDate = new Date(sortedRows[0].date + "T00:00:00Z");

  type WeekBucket = {
    startDate: Date;
    visits: Record<VariationId, number>;
    conversions: Record<VariationId, number>;
  };

  const buckets: WeekBucket[] = [];

  for (const row of sortedRows) {
    const currentDate = new Date(row.date + "T00:00:00Z");
    const diffDays = Math.floor(
      (currentDate.getTime() - firstDate.getTime()) / DAY_MS
    );
    const weekIndex = Math.floor(diffDays / 7); // 0 - первая неделя, 1 - вторая и тд

    if (!buckets[weekIndex]) {
      buckets[weekIndex] = {
        startDate: new Date(firstDate.getTime() + weekIndex * 7 * DAY_MS),
        visits: {},
        conversions: {},
      };
    }

    const bucket = buckets[weekIndex];

    for (const variation of variations) {
      const varId = variation.id;
      const visits = row.visits[varId];
      const conversions = row.conversions[varId];

      // Если для этой вариации в этот день нет данных - просто пропускаем
      if (visits != null && conversions != null) {
        bucket.visits[varId] = (bucket.visits[varId] ?? 0) + visits;
        bucket.conversions[varId] =
          (bucket.conversions[varId] ?? 0) + conversions;
      }
    }
  }

  return buckets.map((bucket, index) => {
    const values: Record<VariationId, number | null> = {};

    for (const variation of variations) {
      const varId = variation.id;
      const visits = bucket.visits[varId];
      const conversions = bucket.conversions[varId];

      if (visits != null && visits > 0 && conversions != null) {
        values[varId] = (conversions / visits) * 100;
      } else {
        values[varId] = null;
      }
    }

    return {
      date: bucket.startDate,
      dateLabel: `Week ${index + 1}`,
      values,
    };
  });
}

// Главная функция подготовки данных
export function prepareAbTestData(raw: RawData): PreparedAbTestData {
  const variations = normalizeVariations(raw);
  const dailyPoints = buildDailyPoints(raw, variations);
  const weeklyPoints = buildWeeklyPoints(raw, variations);

  return {
    variations,
    dailyPoints,
    weeklyPoints,
  };
}
