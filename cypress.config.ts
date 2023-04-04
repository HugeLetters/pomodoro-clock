import { defineConfig } from "cypress";

export default defineConfig({
  fixturesFolder: "./fixtures",

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
