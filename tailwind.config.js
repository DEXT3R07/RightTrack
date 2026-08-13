/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 950: "#070f24", 900: "#0b1730", 800: "#0f1e3d", 700: "#152850", 600: "#1c3466", 100: "#e6eaf5" },
        bearing: { 600: "#1e4fd9", 500: "#2f62ec", 400: "#5f85f2", 100: "#e8edfd" },
        brass: { 600: "#a9821f", 500: "#c9a227", 400: "#dfc069", 100: "#f8f0da" },
        ink: { 900: "#0d1220", 700: "#333a4d", 500: "#616a80", 300: "#a6acbd" },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        body: ['"Inter"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(13,18,32,0.04), 0 8px 24px -12px rgba(13,18,32,0.12)",
        pop: "0 20px 60px -15px rgba(11,23,48,0.35)",
      },
      keyframes: {
        fadein: { "0%": { opacity: 0, transform: "translateY(6px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        pulsew: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.45 } },
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
      },
      animation: {
        fadein: "fadein .35s ease-out both",
        pulsew: "pulsew 1.6s ease-in-out infinite",
        floaty: "floaty 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
