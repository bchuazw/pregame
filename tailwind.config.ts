import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#08070d",
        paper: "#fafaf7",
        hype: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#f97316",
          700: "#ea580c",
          800: "#c2410c",
          900: "#9a3412",
        },
        vibe: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        flame: {
          300: "#fb7185",
          400: "#f43f5e",
          500: "#ec4899",
          600: "#db2777",
        },
        cyber: {
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "shimmer": "shimmer 2s ease-in-out infinite",
        "marquee": "marquee 40s linear infinite",
        "marquee-slow": "marquee 70s linear infinite",
        "wobble": "wobble 4s ease-in-out infinite",
        "bounce-in": "bounce-in 0.65s cubic-bezier(.2,1.3,.4,1) both",
        "stamp": "stamp 0.55s cubic-bezier(.2,1.4,.4,1) both",
        "spin-slow": "spin 14s linear infinite",
        "tilt": "tilt 5s ease-in-out infinite",
        "drift": "drift 18s ease-in-out infinite",
        "glitch-x": "glitch-x 3.6s infinite steps(1)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "wobble": {
          "0%,100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        "bounce-in": {
          "0%": { opacity: "0", transform: "scale(.7) translateY(30px)" },
          "60%": { opacity: "1", transform: "scale(1.05) translateY(-4px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "stamp": {
          "0%": { opacity: "0", transform: "scale(1.6) rotate(-8deg)" },
          "60%": { opacity: "1", transform: "scale(0.95) rotate(-2deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(-2deg)" },
        },
        "tilt": {
          "0%,100%": { transform: "rotate(-1.5deg)" },
          "50%": { transform: "rotate(1.5deg)" },
        },
        "drift": {
          "0%,100%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(20px,-20px)" },
        },
        "glitch-x": {
          "0%,92%,100%": { transform: "translateX(0)" },
          "93%": { transform: "translateX(-3px)" },
          "94%": { transform: "translateX(3px)" },
          "95%": { transform: "translateX(-1px)" },
          "96%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
