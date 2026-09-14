/**
 * Generated from design-tokens.json (source: invoice-template-customizer-final.html).
 *
 * This repo runs Tailwind v4 via `@tailwindcss/vite`, which is CSS-first —
 * `src/index.css` currently only has `@import 'tailwindcss';` and does NOT
 * read this file automatically. To activate it, add one line above the
 * import:
 *
 *   @config "../tailwind.config.ts";
 *   @import "tailwindcss";
 *
 * Alternative (more idiomatic v4, no JS config at all): paste the `css`
 * string from design-tokens.json into an `@theme { ... }` block in
 * src/index.css instead of using this file. Either path produces the same
 * `--color-*` / `--spacing-*` / etc. CSS variables and the same utilities.
 *
 * Two things to know before you rely on this:
 *
 * 1. Several keys below OVERRIDE Tailwind's built-in defaults for the whole
 *    app, not just this screen — fontSize.sm/base/lg/xl/2xl/3xl, lineHeight.*,
 *    letterSpacing.tight/normal/wide/wider/widest, borderRadius.sm/md/lg,
 *    boxShadow.xs/md, fontFamily.mono. That's intentional if this direction
 *    is becoming the app-wide system (which is how this session's brief
 *    read); if you want it scoped to just the invoice customizer, rename
 *    these to non-colliding keys (e.g. `fontSize['invoice-sm']`) instead.
 * 2. The semantic colours (accent-soft, muted-text, …) are `color-mix()`
 *    expressions that reference `var(--color-accent)`, `var(--color-fg)`,
 *    etc. — Tailwind v4's own generated variable names for the primitives
 *    below, not the shorter `--accent` / `--fg` names used in the original
 *    HTML prototype. Keep the primitive colour keys as-is (or update both
 *    sides together) or these derived colours will resolve to nothing.
 */
import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      colors: {
        // primitive
        bg: 'oklch(99% 0.002 240)',
        surface: 'oklch(100% 0 0)',
        fg: 'oklch(18% 0.012 250)',
        muted: 'oklch(54% 0.012 250)',
        border: 'oklch(92% 0.005 250)',
        accent: 'oklch(58% 0.18 255)',
        warn: 'oklch(72% 0.15 75)',

        // semantic — derived via color-mix(), reference Tailwind's own
        // generated --color-* variables for the primitives above
        'accent-soft':
          'color-mix(in oklch, var(--color-accent) 14%, transparent)',
        'accent-ink': 'color-mix(in oklch, var(--color-accent) 84%, black)',
        'fg-soft': 'color-mix(in oklch, var(--color-fg) 6%, transparent)',
        'fg-softer': 'color-mix(in oklch, var(--color-fg) 3%, transparent)',
        // >=4.5:1 contrast on --color-bg — the only variant of `muted` approved for small text
        'muted-text':
          'color-mix(in oklch, var(--color-muted) 80%, var(--color-fg))',
        'border-strong':
          'color-mix(in oklch, var(--color-border) 70%, var(--color-fg))',
        'warn-soft': 'color-mix(in oklch, var(--color-warn) 18%, transparent)',
        'warn-ink': 'color-mix(in oklch, var(--color-warn) 55%, black)',
      },

      // Tailwind's default 4px scale already covers every step we use
      // except these three half/odd steps — patch the gaps, don't
      // redeclare the whole scale.
      spacing: {
        '4.5': '18px',
        '13': '52px',
        '27': '108px',
      },

      // Overrides Tailwind's default type scale app-wide (see note above).
      fontSize: {
        '2xs': '10px',
        xs: '11px',
        sm: '12px',
        md: '13px',
        base: '14px',
        lg: '15px',
        xl: '17px',
        '2xl': '20px',
        '3xl': '22px',
        '5xl': '26px',
        '7xl': '40px',
      },

      fontWeight: {
        medium: '500',
        semibold: '600',
        bold: '700',
      },

      // Overrides Tailwind's default line-height scale app-wide.
      lineHeight: {
        tight: '1',
        snug: '1.2',
        normal: '1.3',
        relaxed: '1.5',
      },

      // Overrides Tailwind's default letter-spacing scale app-wide
      // (adds `snug`, which has no Tailwind default).
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.02em',
        snug: '-0.015em',
        normal: '-0.005em',
        wide: '0.02em',
        wider: '0.06em',
        widest: '0.07em',
      },

      // Overrides Tailwind's default radius scale for sm/md/lg app-wide.
      borderRadius: {
        xs: '6px',
        sm: '8px',
        md: '10px',
        lg: '12px',
        pill: '999px',
      },

      borderWidth: {
        DEFAULT: '1px',
        2: '2px',
      },

      // Overrides Tailwind's default xs/md shadow app-wide.
      boxShadow: {
        xs: '0 1px 2px color-mix(in oklch, var(--color-fg) 8%, transparent)',
        md: '0 1px 2px color-mix(in oklch, var(--color-fg) 6%, transparent), 0 12px 32px -12px color-mix(in oklch, var(--color-fg) 12%, transparent)',
      },

      // Named durations alongside Tailwind's numeric scale — additive, no collision.
      transitionDuration: {
        fast: '150ms',
        snap: '50ms',
      },

      // New keys, additive — no collision with Tailwind's numeric z-index scale.
      zIndex: {
        appbar: '10',
        sticky: '9',
      },

      // `mono` overrides Tailwind's default mono stack app-wide; `display`/`body` are additive.
      fontFamily: {
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          "'SF Pro Display'",
          'system-ui',
          'sans-serif',
        ],
        body: [
          '-apple-system',
          'BlinkMacSystemFont',
          "'SF Pro Text'",
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          "'JetBrains Mono'",
          "'SF Mono'",
          'Menlo',
          'monospace',
        ],
      },

      // Component-tier constants (named intent, not part of a generic scale).
      width: {
        'control-sm': '36px',
        'control-md': '44px',
        'pane-customize': '520px',
      },
      height: {
        'control-sm': '36px',
        'control-md': '44px',
        appbar: '56px',
      },
      maxWidth: {
        paper: '760px',
        'invoice-logo': '200px',
      },
    },
  },
} satisfies Config
