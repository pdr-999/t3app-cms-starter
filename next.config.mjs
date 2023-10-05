/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

/** @type {import("next").NextConfig} */
let config = {
  reactStrictMode: false,
  typescript: {
    tsconfigPath: "./tsconfig.build.json",
  },

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/cms/books",
  //       permanent: true,
  //     },
  //   ];
  // },
};

if (process.env.ANALYZE === "true") {
  const { default: NextBundleAnalyzer } = await import("@next/bundle-analyzer");

  const withBundleAnalyzer = NextBundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
  });

  config = withBundleAnalyzer(config);
}

export default config;
