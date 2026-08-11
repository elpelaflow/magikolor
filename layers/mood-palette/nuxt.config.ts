export default defineNuxtConfig({
  runtimeConfig: {
    unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY ?? '',
    pexelsApiKey: process.env.PEXELS_API_KEY ?? '',
    pixabayApiKey: process.env.PIXABAY_API_KEY ?? ''
  }
});
