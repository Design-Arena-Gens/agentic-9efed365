import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#0f111a",
        panel: "#161a2b",
        accent: "#3a7bff",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-fira)", "Fira Code", "ui-monospace", "SFMono-Regular"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(58, 123, 255, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
