import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gruvbox: {
          bg: '#1d2021',
          fg: '#ebdbb2',
          red: '#fb4934',
          green: '#b8bb26',
          yellow: '#d79921',
          blue: '#83a598',
          gray: '#928374',
        }
      },
    },
  },
  plugins: [],
};
export default config;
