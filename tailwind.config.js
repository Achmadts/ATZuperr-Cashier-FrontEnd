import daisyui from 'daisyui';
import scrollbarHide from 'tailwind-scrollbar-hide';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF9FE',
        blue: '#36B4E5',
        primary1: '#05445E',
        success: '#00FF6E',
        error: '#D92525',
      },
      fontFamily: {
        sans: ['"Nunito Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [daisyui, scrollbarHide],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#4cceac',     // Use primary1 color
          secondary: '#36B4E5',   // Use blue color
          accent: '#F2F3F3',      // Use background color
          neutral: '#3D4451',
          success: '#00FF6E',
          error: '#D92525',
          'base-100': '#FFFFFF',
        },
      },
    ],
  },
};
