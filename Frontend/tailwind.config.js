/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "gradient-shift": "gradient-shift 8s ease infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        glow: "0 0 24px rgba(var(--primary), 0.15)",
        "glow-lg": "0 0 40px rgba(var(--primary), 0.2)",
        elevated:
          "0 1px 2px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)",
        "elevated-lg":
          "0 2px 4px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
