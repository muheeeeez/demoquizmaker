// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-03-19",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  ssr: false,
  plugins: ["~/plugins/initAuth.client.js"],
});
