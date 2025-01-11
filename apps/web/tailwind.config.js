/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    // require('tailwindcss-animate'),
    require("tailwindcss/plugin")(({ addUtilities }) => {
      addUtilities({
        ".app-drag": {
          "-webkit-app-region": "drag",
          cursor: "move",
        },
        ".app-drag-none": {
          "-webkit-app-region": "no-drag",
        },
      });
    }),
  ],
};
