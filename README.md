# Kameleoon A/B Test Conversion Chart

Interactive line chart for visualizing A/B test conversion statistics.
The project is built with **React + TypeScript + Vite** and hosted on **GitHub Pages**.

Live demo: [https://romanov-km.github.io/kameleoon-test/](https://romanov-km.github.io/kameleoon-test/)

---

## Visualization library

The chart is implemented with **[Recharts](https://recharts.org/en-US/)**.

Reasons for choosing Recharts:

* high-level React components for common chart types (LineChart, AreaChart, etc.);
* good support for custom tooltips, cursors and responsive layouts;
* simple API for switching line types and areas, which fits the design of the test task.

---

## Implemented features

### Core requirements

* **Conversion rate line chart**

  * Shows `conversionRate` for all variations on the same chart.
  * Y-axis displays values in percentages with dynamic domain based on visible series.
  * X-axis shows dates (day or week labels).

* **Data source & transformation**

  * Data is loaded from `data.json`.
  * `visits` and `conversions` are aggregated and converted to `conversionRate` for each variation.
  * Supports **Day / Week** aggregation with recomputation of the series.

* **Tooltip & hover interaction**

  * Vertical hover line synced with the cursor.
  * Custom tooltip with:

    * formatted date,
    * list of variations with colored dots,
    * conversion values formatted as percentages.

* **Variations selector**

  * Multi-select control to toggle individual variations.
  * At least **one variation is always selected** (cannot hide all lines).
  * When variations are toggled, X and Y axes recompute their domains to fit visible data.

* **Adaptive axes & percentages**

  * All values (lines, tooltip, Y-axis) are displayed in percentages.
  * Y-axis domain is computed from visible series with padding and clamped to `[0, 100]`.

* **Responsive layout**

  * Layout adapts to screens from **671 px to 1300 px**:

    * controls wrap when needed,
    * chart keeps aspect ratio and readable labels.

---

## Bonus features

* **Line style selector**

  `Line style:`

  * `line` – simple linear lines,
  * `smooth` – smooth curves,
  * `area` – filled area chart under the lines,
  * `highlight` – “highlighted” style: a thick semi-transparent line plus a thin solid line on top (matches the provided mockup).

* **Zoom controls**

  * `-` / `+` buttons to zoom the chart.
  * `↻` button to reset zoom to the initial state.
  * Zoom affects the visible range of points on the X-axis.

* **Fullscreen mode**

  * Separate button to toggle a fullscreen-like layout.
  * In fullscreen mode the chart takes the whole viewport width and height (no paddings, no card border radius).

* **Light / Dark theme toggle**

  * `Light` / `Dark` themes for the entire page and chart.
  * In dark mode:

    * background switches to a dark blue color (similar to the mockup),
    * axes, grid and text colors are adjusted for contrast,
    * lines keep their brand colors.

* **Export chart to PNG**

  * Button to export the current chart view (with active theme, visible variations, period and zoom) to a **PNG image**.
  * Implemented with `html-to-image` and downloading the generated data URL as a file.

* **GitHub Pages deployment via GitHub Actions**

  * CI workflow:

    * installs dependencies,
    * runs TypeScript check and `vite build`,
    * publishes `dist` to `gh-pages` branch using `peaceiris/actions-gh-pages`.
  * Pages are served from `gh-pages` / root.

---

## Local setup

### Requirements

* Node.js **20+**
* npm (or pnpm / yarn, if you prefer)

### Installation

```bash
# clone the repository
git clone https://github.com/romanov-km/kameleoon-test.git

cd kameleoon-test

# install dependencies
npm install
# or
# pnpm install
# yarn install
```

### Development

```bash
# start dev server on http://localhost:5173
npm run dev
```

The app will automatically reload when you change the source files.

### Production build

```bash
# type-check and build production bundle
npm run build
```

This will run `tsc -b` and then `vite build`, generating the production build in `dist/`.

### Preview production build (optional)

```bash
npm run preview
```

This serves the built app from `dist/` so you can test the production bundle locally.

---

## Project structure (high level)

* `src/app/App.tsx` – main layout, controls, state and data wiring.
* `src/components/Chart/ConversionChart.tsx` – Recharts-based line/area chart.
* `src/components/Controls/*` – UI controls:

  * variations selector,
  * period toggle (Day / Week),
  * line style selector,
  * zoom controls,
  * light/dark theme toggle.
* `src/components/Chart/CustomTooltip.tsx` – custom tooltip component.
* `src/utils/parseData.ts` – data loading and conversion from `data.json` to chart points.
* `src/types/abTest.ts` – TypeScript types for variations and chart points.
* `public/data.json` (or `src/data.json`) – source A/B test data.

---

## Links

* Live demo: [https://romanov-km.github.io/kameleoon-test/](https://romanov-km.github.io/kameleoon-test/)
* Repository: [https://github.com/romanov-km/kameleoon-test](https://github.com/romanov-km/kameleoon-test)
