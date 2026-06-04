import { CvsmPreset } from './theme/cvsm-preset'

export default defineNuxtConfig({
  compatibilityDate: '2025-06-04',
  experimental: {
    // Vite 7 pre-transform не резолвит #app-manifest в dev (см. nuxt#30461)
    appManifest: false,
  },
  devtools: { enabled: false },
  css: ['~/assets/css/tokens.css', '~/assets/css/neomorphic.css', 'primeicons/primeicons.css'],
  modules: ['@primevue/nuxt-module'],
  primevue: {
    options: {
      theme: {
        preset: CvsmPreset,
        options: {
          darkModeSelector: false,
        },
      },
    },
  },
  app: {
    head: {
      title: 'ВСМ — Модель развития сети',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Onest:wght@400;500;700&display=swap',
        },
      ],
    },
  },
})
