/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './posts/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'text-main': 'var(--color-text)',
        'text-light': 'var(--color-text-light)',
        'bg-main': 'var(--color-background)',
        'sidebar-bg': 'var(--color-sidebar-bg)',
        'border-main': 'var(--color-border)',
        'border-light': 'var(--color-border-light)',
        'code-bg': 'var(--color-code-bg)',
        'tag-bg': 'var(--color-tag-bg)',
        'tag-text': 'var(--color-tag-text)',
        'button-bg': 'var(--color-button-bg)',
        'button-hover': 'var(--color-button-hover)',
        'blockquote-bg': 'var(--color-block-quote-bg)',
      },
      fontFamily: {
        'heading': 'var(--font-heading)',
        'body': 'var(--font-body)',
      },
      spacing: {
        'sidebar': 'var(--sidebar-width)',
      },
      maxWidth: {
        'content': 'var(--content-max-width)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

