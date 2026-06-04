import { definePreset } from '@primeuix/themes'
import Aura from '@primevue/themes/aura'

export const CvsmPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f2f3fa',
      100: '#e8eaf5',
      200: '#c8cce5',
      300: '#9ea5d1',
      400: '#4e5ba6',
      500: '#4e5ba6',
      600: '#1c3a73',
      700: '#1c3a73',
      800: '#152d5c',
      900: '#0f2245',
      950: '#0a1833',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#f9f9f9',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e9eaeb',
          300: '#d5d7da',
        },
        primary: {
          color: '#4e5ba6',
          contrastColor: '#f2f3fa',
          hoverColor: '#1c3a73',
          activeColor: '#152d5c',
        },
        text: {
          color: '#1c3a73',
          mutedColor: '#60759b',
          hoverColor: '#1c3a73',
        },
      },
    },
  },
})
