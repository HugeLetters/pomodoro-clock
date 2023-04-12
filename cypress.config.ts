import { defineConfig } from "cypress";

export default defineConfig({
  fixturesFolder: "./fixtures",
  port: 5174,
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  e2e: {
    baseUrl: "http://localhost:5173/",  
  },
});
