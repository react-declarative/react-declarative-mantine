import { defineConfig } from "vite";
import fullReload from "vite-plugin-full-reload";
import react from "@vitejs/plugin-react";
import checker from 'vite-plugin-checker';
import million from "million/compiler";
import path from "path";

export default defineConfig({
  plugins: [checker({ typescript: false }),
  react(),
  fullReload(["**/*.ts*", "**/*.js*", "**/*.mjs"], {
    always: true,
    root: "src",
  }), million.vite({
    mode: "vdom",
  }),
  ],
  build: {
    target: "chrome87",
    outDir: "build",
    minify: "terser",
  },
  server: {
    hmr: false,
  },
  resolve: {
    alias: {
      "react-declarative-mantine": path.resolve(__dirname, "../dist/index.esm.js"),
    },
  },
  optimizeDeps: {
    exclude: [
      'react-declarative-mantine'
    ]
  }
})
