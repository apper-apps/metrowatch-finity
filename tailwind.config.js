/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A5F",
        secondary: "#2D5016",
        accent: "#00D4FF",
        surface: "#1A1A1A",
        background: "#0D0D0D",
        success: "#00C851",
        warning: "#FFB300",
        error: "#FF3547",
        info: "#33B5E5",
        border: "#2A2A2A",
        text: {
          primary: "#FFFFFF",
          secondary: "#B0B0B0",
          muted: "#808080"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-alert': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}