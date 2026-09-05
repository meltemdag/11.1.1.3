/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 17-18. yüzyıl Osmanlı diplomasisi temalı tarihî palet
        parchment: {
          50: '#fbf7ec',
          100: '#f6efdc',
          200: '#ecdfc0',
          300: '#ddc99b',
          400: '#c9ab72',
          500: '#b08d4f',
          600: '#8f6c36',
          700: '#6f5228',
          800: '#4d381b',
          900: '#31230f',
        },
        ink: {
          DEFAULT: '#2b1d10',
          light: '#4a3421',
          soft: '#6b5137',
        },
        seal: {
          DEFAULT: '#7c1d1d',   // balmumu mühür kırmızısı
          dark: '#5f1414',
          light: '#9b3030',
        },
        brass: {
          DEFAULT: '#a3762a',   // pirinç / yaldız
          light: '#c99e4f',
          pale: '#e8d5a4',
        },
        olive: {
          seal: '#4d5d23',      // zeytin yeşili (tamamlanmış)
        },
        meb: {
          blue: '#1e3a8a',
          navy: '#0f172a',
          gold: '#b45309',
          amber: '#d97706',
          bg: '#f8fafc',
          card: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        // Tarihî görünüm için klasik garamon ve kitabe hissi veren başlık fontu
        antique: ['"EB Garamond"', 'Georgia', 'serif'],
        seal: ['Cinzel', 'Georgia', 'serif'],
      },
      boxShadow: {
        // Eski evrak hissi: yumuşak, sıcak gölgeler
        'parchment': '0 1px 3px rgba(74, 52, 33, 0.18), 0 4px 14px rgba(74, 52, 33, 0.10)',
        'parchment-lg': '0 4px 10px rgba(74, 52, 33, 0.22), 0 10px 28px rgba(74, 52, 33, 0.14)',
        'wax': 'inset 0 1px 3px rgba(0,0,0,0.35), 0 2px 4px rgba(43, 29, 16, 0.35)',
      },
      backgroundImage: {
        // Kart içi ince parşömen dokusu (SVG gürültü)
        'parchment-texture': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.055'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        'parchment-texture-dark': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.12'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
