/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    "from-indigo-50",
    "to-purple-100",
    "text-indigo-700",
    "text-purple-700",
    "bg-indigo-50",
    "bg-indigo-600",
    "bg-indigo-700",
    "bg-purple-600",
    "bg-purple-700",
    "hover:bg-indigo-700",
    "hover:bg-purple-700",
    "border-indigo-200",
    "border-indigo-300",
  ],
  plugins: [],
};
