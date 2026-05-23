import type { Config } from 'tailwindcss'

// Mirrors the inline `tailwind.config` from dolphhtml/*.html so the ported
// markup keeps 1:1 fidelity (brand/ink palette, custom shadows, Inter font).
export default <Partial<Config>>{
  darkMode: 'class',
  // Bootstrap (still loaded for not-yet-migrated pages) ships utilities like
  // `.bg-white`, `.text-white`, `.border` with `!important`, which would beat
  // Tailwind's `dark:` variants and break dark mode on the new components.
  // Making Tailwind utilities `!important` lets them win.
  important: true,
  // Disable Tailwind's `.container` so it doesn't clash with Bootstrap's own
  // `.container` (which legacy pages rely on). New components use `max-w-* mx-auto`.
  corePlugins: { container: false },
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        brand: { 50: '#FFF1EA', 100: '#FFE0CF', 400: '#FF6A2E', 500: '#FF4800', 600: '#E53E00', 700: '#CC3700' },
        ink: { 950: '#0B0F19', 900: '#111827', 800: '#1F2937', 700: '#374151', 600: '#4B5563', 500: '#6B7280', 400: '#9CA3AF', 300: '#D1D5DB', 200: '#E5E7EB', 100: '#F3F4F6', 50: '#F9FAFB' },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(17,24,39,.04), 0 4px 16px rgba(17,24,39,.06)',
        pop: '0 10px 30px rgba(255,72,0,.25)',
        card: '0 1px 2px rgba(17,24,39,.05), 0 8px 24px rgba(17,24,39,.08)',
        lift: '0 12px 32px rgba(17,24,39,.12), 0 4px 8px rgba(17,24,39,.06)',
      },
    },
  },
}
