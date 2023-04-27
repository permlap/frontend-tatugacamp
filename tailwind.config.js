/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  important: "#__next",
  theme: {
    extend: {
      keyframes: {
        wave: {
          "0%%": { transform: "translateY(0rem)" },
          "50%": { transform: "translateY(40rem)" },
          "100%": { transform: "translateY(0rem)" },
        },
      },
      animation: {
        "wave-infinite": "wave 25s ease-in-out infinite",
      },
      fontFamily: {
        Inter: ["Inter", "sans-serif"],
        Kanit: ["Kanit", "sans-serif"],
        Poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        insetShadow: "inset  0px -12px 10px 0px rgba(0, 0, 0, 0.3)",
        myShadow1: "4.1px -5px 0 0 rgb(17,24,39)",
        myShadow2: "-4.1px -5px 0 0 rgb(17,24,39)",
        boxShadow1: "4px 3px 0 0 #ffffff",
        boxShadow2: "-4px 3px 0 0 #ffffff",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
