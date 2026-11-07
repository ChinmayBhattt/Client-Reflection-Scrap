import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        brand: {
          blue: "#3B8BC4",
          "blue-hover": "#2e74a6",
          "blue-light": "#eef6fb",
          green: "#5BAE65",
          "green-hover": "#4a9953",
          "green-light": "#edf7ee",
          dark: "#111111",
          muted: "#555555",
          border: "#E2E4DE",
          surface: "#FFFFFF",
          bg: "#FAFAF7",
        },
        primary: {
          DEFAULT: "#3B8BC4",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#5BAE65",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#5BAE65",
          foreground: "#FFFFFF",
        },
        background: "#FAFAF7",
        foreground: "#111111",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#111111",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#111111",
        },
        muted: {
          DEFAULT: "#F1F2ED",
          foreground: "#666666",
        },
        destructive: {
          DEFAULT: "#E53E3E",
          foreground: "#FFFFFF",
        },
        border: "#E2E4DE",
        input: "#E2E4DE",
        ring: "#3B8BC4",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
        elevated: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;

