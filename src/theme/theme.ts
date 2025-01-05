import { createSystem, defaultConfig } from '@chakra-ui/react';

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: 'Roboto, sans-serif' },
        body: { value: 'Roboto, sans-serif' },
      },
      colors: {
        brand: {
          50: { value: '#e6f9f0' },
          100: { value: '#b3e8d1' },
          200: { value: '#80d7b3' },
          300: { value: '#4dc695' },
          400: { value: '#01bc66' },
          500: { value: '#019a54' },
          600: { value: '#016a3a' },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: '{colors.brand.400}' },
          contrast: { value: '{colors.brand.50}' },
          fg: { value: '{colors.brand.600}' },
          muted: { value: '{colors.brand.200}' },
          subtle: { value: '{colors.brand.300}' },
          emphasized: { value: '{colors.brand.400}' },
          focusRing: { value: '{colors.brand.400}' },
        },
      },
    },
  },
});
