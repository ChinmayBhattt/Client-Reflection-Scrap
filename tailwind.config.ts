import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: [
    "variant",
    [
      "@media (prefers-color-scheme: dark) { &:not(:root:has(> head > meta[name=\"color-scheme\"][content=\"light\"]) *) }",
      ":root:has(> head > meta[name=\"color-scheme\"][content=\"dark\"]) &",
    ],
  ],
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
          blue: "rgb(var(--brand-blue) / <alpha-value>)",
          "blue-hover": "rgb(var(--brand-blue-hover) / <alpha-value>)",
          "blue-light": "rgb(var(--brand-blue-light) / <alpha-value>)",
          green: "rgb(var(--brand-green) / <alpha-value>)",
          "green-hover": "rgb(var(--brand-green-hover) / <alpha-value>)",
          "green-light": "rgb(var(--brand-green-light) / <alpha-value>)",
          dark: "rgb(var(--brand-dark) / <alpha-value>)",
          muted: "rgb(var(--brand-muted) / <alpha-value>)",
          border: "rgb(var(--brand-border) / <alpha-value>)",
          surface: "rgb(var(--brand-surface) / <alpha-value>)",
          bg: "rgb(var(--brand-bg) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--brand-blue) / <alpha-value>)",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "rgb(var(--brand-green) / <alpha-value>)",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "rgb(var(--brand-green) / <alpha-value>)",
          foreground: "#FFFFFF",
        },
        background: "rgb(var(--brand-bg) / <alpha-value>)",
        foreground: "rgb(var(--brand-dark) / <alpha-value>)",
        card: {
          DEFAULT: "rgb(var(--brand-surface) / <alpha-value>)",
          foreground: "rgb(var(--brand-dark) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--brand-surface) / <alpha-value>)",
          foreground: "rgb(var(--brand-dark) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted-bg) / <alpha-value>)",
          foreground: "rgb(var(--muted-fg) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "#E53E3E",
          foreground: "#FFFFFF",
        },
        border: "rgb(var(--brand-border) / <alpha-value>)",
        input: "rgb(var(--brand-border) / <alpha-value>)",
        ring: "rgb(var(--brand-blue) / <alpha-value>)",
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
