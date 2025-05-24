/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "w-6", "h-6",
    "w-8", "h-8",
    "w-12", "h-12",
    "w-16", "h-16",

    "border-t-blue-500",
    "border-t-green-500",
    "border-t-red-500",
    "border-t-gray-500",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
