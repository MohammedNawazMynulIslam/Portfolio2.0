import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        glass: {
          bg: "var(--glass-bg)",
          border: "var(--glass-border)",
          shadow: "var(--glass-shadow)",
        },
      },
      fontFamily: {
        georama: ["var(--font-georama)", "sans-serif"],
        "roboto-mono": ["var(--font-roboto-mono)", "monospace"],
      },
      boxShadow: {
        window: "var(--window-shadow)",
        dock: "var(--dock-shadow)",
      },
    },
  },
};

export default config;
