export default defineNuxtConfig({
  runtimeConfig: {
    mongo: {
      url: process.env.MONGO_URL ?? 'mongodb://magikolor:secret@localhost:27018/magikolor?authSource=admin'
    }
  }
});
