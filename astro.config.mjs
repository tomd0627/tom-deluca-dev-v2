import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          quietDeps: true,
        },
      },
    },
  },
});
