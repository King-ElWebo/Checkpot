import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    vinext(),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
  define: {
    "process.env.R2_PUBLIC_URL_PREFIX": JSON.stringify(
      process.env.R2_PUBLIC_URL_PREFIX || "https://pub-d104550208504f90bd5895715e62a484.r2.dev"
    ),
  },
});
