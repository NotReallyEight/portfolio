import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  future: {
    v8_splitRouteModules: true,
    v8_viteEnvironmentApi: true,
  },
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,
} satisfies Config;
