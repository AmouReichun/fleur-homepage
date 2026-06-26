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
        // ── ブログ統合分 ──
        hair: {
          bg: "#F7F5F2",
          surface: "#FFFFFF",
          border: "#E0DBD5",
          text: "#1E1B18",
          muted: "#6B6460",
          accent: "#7F9882",
          "accent-warm": "#BBA98A",
        },
        eye: {
          bg: "#FBF8F8",
          surface: "#FFFFFF",
          border: "#EDD9DC",
          text: "#262022",
          muted: "#8A7275",
          accent: "#C8788A",
          "accent-soft": "#F2DDE1",
        },
        group: {
          text: "#1A1818",
          muted: "#6B6460",
          border: "#E0DBD5",
          bg: "#F9F7F5",
        },
      },
      fontFamily: {
        serif: ["var(--font-noto-serif-jp)", "serif"],
        sans: ["var(--font-noto-sans-jp)", "sans-serif"],
        // ── ブログ統合分 ──
        mincho: ["var(--font-shippori)", "Hiragino Mincho ProN", "serif"],
        cormorant: ["var(--font-cormorant)", "Georgia", "serif"],
        kaku: ["var(--font-kaku)", "Hiragino Kaku Gothic ProN", "sans-serif"],
        jakarta: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        dm: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        dancing: ["var(--font-cormorant)", "Georgia", "serif"],
        pacifico: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      lineHeight: {
        relaxed: "1.85",
        snug: "1.55",
      },
      maxWidth: {
        article: "720px",
        wide: "1080px",
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
