/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ehr: {
          primary: '#2563eb',
          secondary: '#7c3aed',
          success: '#059669',
          warning: '#d97706',
          danger: '#dc2626',
          info: '#0891b2',
          bg: {
            primary: '#f8fafc',
            secondary: '#f1f5f9',
            card: '#ffffff',
            dark: '#1e293b'
          },
          text: {
            primary: '#0f172a',
            secondary: '#475569',
            muted: '#94a3b8'
          },
          border: '#e2e8f0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'ehr': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'ehr-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'ehr-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
      }
    },
  },
  plugins: [],
}
