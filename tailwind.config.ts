import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gcoin: {
          gold: '#F6D365',
          bronze: '#D9A441',
          ink: '#111827',
          slate: '#0f172a',
          accent: '#7C3AED',
          mint: '#34D399',
        },
      },
      boxShadow: {
        glow: '0 0 30px rgba(246, 211, 101, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
