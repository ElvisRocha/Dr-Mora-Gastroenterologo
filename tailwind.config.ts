import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        navy: "hsl(var(--navy) / <alpha-value>)",
        leaf: "hsl(var(--leaf) / <alpha-value>)",
        teal: "hsl(var(--teal) / <alpha-value>)",
        amber: "hsl(var(--amber) / <alpha-value>)",
        coral: "hsl(var(--coral) / <alpha-value>)",
        offwhite: "hsl(var(--offwhite) / <alpha-value>)",
        offblack: "hsl(var(--offblack) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--navy) / <alpha-value>)",
          foreground: "hsl(var(--offwhite) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--leaf) / <alpha-value>)",
          foreground: "hsl(var(--offblack) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      fontSize: {
        "fluid-display": "clamp(2.5rem, 5vw + 1rem, 5.5rem)",
        "fluid-h1": "clamp(2rem, 4vw + .5rem, 4rem)",
        "fluid-h2": "clamp(1.5rem, 2.5vw + .5rem, 2.5rem)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px hsl(215 53% 27% / 0.04), 0 4px 16px hsl(215 53% 27% / 0.06)",
        elevated:
          "0 2px 4px hsl(215 53% 27% / 0.05), 0 12px 32px hsl(215 53% 27% / 0.08)",
        ring: "0 0 0 1px hsl(var(--border) / 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "soft-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        accordion: {
          "0%": { height: "0", opacity: "0" },
          "100%": { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.32, 0.72, 0, 1) both",
        "fade-in": "fade-in .6s ease-out both",
        "soft-pulse": "soft-pulse 3s ease-in-out infinite",
        "scale-in": "scale-in .3s ease-out both",
        marquee: "marquee 40s linear infinite",
      },
      transitionTimingFunction: {
        gentle: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
