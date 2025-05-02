import type { Config } from 'tailwindcss';
import { heroui } from '@heroui/theme';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/**/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    heroui({
      addCommonColors: true,
      themes: {
        light: {
          /*
                    colors: {
                        background: '#fafafa',
                        foreground: '#18181b',
                        primary: primary,
                        secondary: secondary,
                        danger: danger,
                        warning: warning,
                        success: success,
                    },*/
        },
        dark: {
          /*
                    colors: {
                        background: '#18181b',
                        foreground: '#fafafa',
                    },*/
        },
      },
    }),
  ],
} satisfies Config;
