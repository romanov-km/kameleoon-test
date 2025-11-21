import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/kameleoon-test/",
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          // извлекаем имя пакета из пути
          const parts = id.split("node_modules/")[1].split("/");
          const pkgName = parts[0].startsWith("@")
            ? `${parts[0]}/${parts[1]}`
            : parts[0];

          // группируем react-пакеты в один чанк
          if (pkgName === "react" || pkgName === "react-dom") {
            return "react";
          }

          // отдельный чанк для recharts
          if (pkgName === "recharts") {
            return "recharts";
          }

          // дефолт: отдельный чанк под каждую либу
          return `vendor-${pkgName.replace("@", "").replace("/", "-")}`;
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
