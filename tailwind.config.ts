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
        "site-bg": "#FAFAF8",
        "site-text": "#2A2A2A",
        "site-muted": "#888888",
        "site-accent": "#B8956A",
        "site-light": "#F5F0EA",
        "site-pink": "#F0E8E8",
        "site-greige": "#E8E4E0",
      },
      fontFamily: {
        serif: ["var(--font-noto-serif-jp)", "serif"],
        sans: ["var(--font-noto-sans-jp)", "sans-serif"],
      },
      keyframes: {
        kenburns: {
          "0%":   { transform: "scale(1) translate(0, 0)" },
          "100%": { transform: "scale(1.12) translate(-2%, -1%)" },
        },
        fadeinup: {
          from: { opacity: "0", transform: "translateY(28px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        kenburns:        "kenburns 16s ease-in-out infinite alternate",
        fadeinup:        "fadeinup 0.9s ease-out forwards",
        "fadeinup-slow": "fadeinup 0.9s ease-out 0.25s both",
        "fadeinup-late": "fadeinup 0.9s ease-out 0.5s both",
      },
    },
  },
  plugins: [],
};
export default config;
