import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        casero: {
          green: "#1F8A5B",
          turquoise: "#18AFC4",
          orange: "#F59E0B",
          beige: "#F4E9D8",
          background: "#FAFAF7",
          dark: "#0F2537",
          text: "#263238",
          white: "#FFFFFF",
          navy: "#0F2537",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        heading: ["var(--font-poppins)", "Poppins", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 37, 55, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
