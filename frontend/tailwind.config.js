/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: ["html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
}

