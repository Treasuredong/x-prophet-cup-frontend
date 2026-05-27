import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pitch: "#07131f",
        ember: "#ff7a18",
        gold: "#f7c94c",
        ice: "#e5f4ff",
        mint: "#6ce5b1"
      },
      boxShadow: {
        glow: "0 0 40px rgba(255, 122, 24, 0.35)",
        card: "0 24px 80px rgba(2, 8, 23, 0.45)"
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at top left, rgba(255,122,24,0.25), transparent 35%), radial-gradient(circle at top right, rgba(76, 201, 240, 0.18), transparent 32%), linear-gradient(180deg, #06101b, #081726 55%, #07111d)"
      }
    }
  },
  plugins: []
};

export default config;

