import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { remixDevTools } from "remix-development-tools";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// put sitemaps




installGlobals();

export default defineConfig({
   server: {
    port: 6236,

  },

  plugins: [

    remixDevTools(), remix({ ignoredRouteFiles: ["**/*.css"] }), tsconfigPaths(),

  ],

});
