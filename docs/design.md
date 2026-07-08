---
version: alpha
name: Kiri
description: Kiri’s design system. Warm, editorial Japanese-craft language with lacquer browns, paper neutrals, and a serif/sans pairing, for a TCG collection-tracking web app.

colors:
  # Light mode (default)
  primary: "#322014"            # Urushi: lacquer brown; primary actions, headings, ink
  on-primary: "#F5F4F2"         # Kami: paper; text/icons on primary
  primary-hover: "#5A3921"      # Kuri: chestnut; hover state of primary surfaces
  accent: "#7E4E2D"             # Haku bronze: links, interactive emphasis
  accent-muted: "#C5A681"       # Tsuchi: earth; decorative fills, tags, dividers
  background: "#EFEEE8"         # Suna: sand; page background
  surface: "#F5F4F2"            # Kami: paper; cards and panels
  surface-raised: "#FAF8F3"     # brand-50; inputs, modals, raised layers
  on-surface: "#322014"         # Urushi: primary text
  on-surface-muted: "#66625F"   # neutral-700; secondary text, captions, meta
  border: "#EAE3D7"             # brand-200; hairline borders
  border-strong: "#DCCBB3"      # brand-300; emphasized borders, disabled fills
  success: "#5C7350"            # moss: earthy green, derived to fit the palette
  warning: "#A9741B"            # ochre: warm amber, derived to fit the palette
  error: "#A22727"              # crimson: fixed brand accent
  info: "#2C50B5"               # indigo: fixed brand accent
  accent-alt: "#7D95A1"         # slate blue: fixed brand accent; categorical coding
  trend-up: "#5C7350"           # alias of success: price gains, positive deltas
  trend-down: "#A22727"         # alias of error: price losses, negative deltas
  # Rarity ladder (badge wash and dot tints; traditional TCG foil colors reinterpreted in the palette's desaturated warmth)
  rarity-common: "#9E9B98"      # warm mid-gray: alias of neutral-500
  rarity-uncommon: "#7D95A1"    # slate: alias of accent-alt
  rarity-rare: "#C39A45"        # old gold: new extension color
  rarity-epic: "#8F7193"        # dusty plum: new extension color
  rarity-mythic: "#C06A3B"      # muted copper flame: new extension color
  rarity-secret: "#5C4A6E"      # deep violet: new extension color; base for the prismatic gradient
  # Haku gradient stops (brand bronze gradient, dark to pale)
  haku-deep: "#52321B"          # gradient stop 1: darkest bronze
  haku-mid: "#7E4E2D"           # gradient stop 2: same value as accent
  haku-bright: "#B78D62"        # gradient stop 3
  haku-pale: "#C5A681"          # gradient stop 4: same value as accent-muted (Tsuchi)
  # Light-mode brand ramp (50–950)
  brand-50: "#FAF8F3"
  brand-100: "#F4F1EB"
  brand-200: "#EAE3D7"
  brand-300: "#DCCBB3"
  brand-400: "#CAB296"
  brand-500: "#B59575"
  brand-600: "#9E7754"
  brand-700: "#835836"
  brand-800: "#5A3921"
  brand-900: "#342115"
  brand-950: "#2B1C13"
  # Light-mode neutral ramp (50–950)
  neutral-50: "#F8F8F8"
  neutral-100: "#EFEFEE"
  neutral-200: "#E2E2E1"
  neutral-300: "#CECDCC"
  neutral-400: "#B8B6B3"
  neutral-500: "#9E9B98"
  neutral-600: "#837F7C"
  neutral-700: "#66625F"
  neutral-800: "#44413F"
  neutral-900: "#272625"
  neutral-950: "#21201F"
  # Dark-mode brand ramp (50–950, runs dark to light)
  brand-dark-50: "#1A120E"
  brand-dark-100: "#2E2019"
  brand-dark-200: "#413026"
  brand-dark-300: "#694F3E"
  brand-dark-400: "#93715A"
  brand-dark-500: "#AC8B70"
  brand-dark-600: "#BEA083"
  brand-dark-700: "#CEB69A"
  brand-dark-800: "#DCCFBC"
  brand-dark-900: "#EAE7E2"
  brand-dark-950: "#F3F3F3"
  # Dark-mode neutral ramp (50–950, runs dark to light)
  neutral-dark-50: "#141414"
  neutral-dark-100: "#242423"
  neutral-dark-200: "#353434"
  neutral-dark-300: "#575553"
  neutral-dark-400: "#7D7875"
  neutral-dark-500: "#97918C"
  neutral-dark-600: "#ABA59E"
  neutral-dark-700: "#BFB9B3"
  neutral-dark-800: "#D4D0CB"
  neutral-dark-900: "#E9E8E4"
  neutral-dark-950: "#F4F3F2"
  # Dark mode
  background-dark: "#1A120E"    # dark brand-50; page background
  surface-dark: "#2E2019"       # dark brand-100; cards and panels
  surface-raised-dark: "#413026" # dark brand-200; inputs, modals, raised layers
  on-surface-dark: "#EAE7E2"    # dark brand-900; primary text
  on-surface-muted-dark: "#ABA59E" # dark neutral-600; secondary text
  border-dark: "#413026"        # dark brand-200; hairline borders
  primary-dark: "#CEB69A"       # dark brand-700: light bronze; primary actions in dark mode
  on-primary-dark: "#1A120E"    # text/icons on primary in dark mode
  accent-dark: "#BEA083"        # dark brand-600; links in dark mode

typography:
  display:
    fontFamily: Newsreader
    fontSize: 60px
    fontWeight: 400
    lineHeight: 1.22
    letterSpacing: -0.025em
  h1:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: 400
    lineHeight: 1.22
    letterSpacing: -0.025em
  h2:
    fontFamily: Newsreader
    fontSize: 36px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: -0.025em
  h3:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: -0.015em
  h4:
    fontFamily: Newsreader
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  body:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  caption:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.01em
  label:
    fontFamily: Geist
    fontSize: 10px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.04em

rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  full: 9999px

spacing:
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 24px
  "6": 32px
  "7": 48px
  "8": 64px
  "9": 96px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: 10px 20px
    height: 40px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: 10px 20px
    height: 40px
  button-primary-disabled:
    backgroundColor: "{colors.border-strong}"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: 10px 20px
    height: 40px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    padding: 10px 20px
    height: 40px
  button-secondary-hover:
    backgroundColor: "{colors.border}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    padding: 10px 20px
    height: 40px
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: 10px 12px
    height: 40px
  input:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: 10px 14px
    height: 40px
  input-focus:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: 10px 14px
    height: 40px
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: 4px 12px
  badge:
    backgroundColor: "#C5A681"
    textColor: "#322014"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 2px 8px
  badge-rarity-common:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.rarity-common}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 2px 8px
  badge-rarity-uncommon:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.rarity-uncommon}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 2px 8px
  badge-rarity-rare:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.rarity-rare}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 2px 8px
  badge-rarity-epic:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.rarity-epic}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 2px 8px
  badge-rarity-mythic:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.rarity-mythic}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 2px 8px
  badge-rarity-secret:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.rarity-secret}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 2px 8px
  badge-dot:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.label}"
    size: 8px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.5}"
  card-featured:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.6}"
    height: 400px
  card-standard:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    width: 320px
  card-compact:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    width: 260px
  card-action:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    height: 40px
    padding: 0px 13px
  card-action-hover:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    height: 40px
    padding: 0px 16px
  nav:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    height: 72px
    padding: 0px 32px
  table-header:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.label}"
    padding: 12px 16px
  table-row:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    padding: 16px 16px
  stat-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.5}"
  alert:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 12px 16px
  toast:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 12px 16px
  modal:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.6}"
    width: 480px
  author-card:
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
  sidebar-list:
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.body-sm}"
  cta-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.5}"
  dropdown-trigger:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    height: 40px
    padding: 10px 20px
  dropdown-menu:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.lg}"
    width: 560px
  dropdown-item:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    padding: 24px 24px
  dropdown-item-hover:
    backgroundColor: "{colors.border}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    padding: 24px 24px
  mega-menu:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.lg}"
    padding: "{spacing.6}"
    width: 680px
  mega-menu-item:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: 6px 10px
  mega-menu-item-hover:
    backgroundColor: "{colors.border}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: 6px 10px
  feature-card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    width: 300px
  footer:
    backgroundColor: "{colors.brand-950}"
    textColor: "#EAE7E2"
    typography: "{typography.body}"
    padding: "{spacing.8}"
  price-chart:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.5}"
    width: 640px
  chart-range-tab:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: 5px 12px
  chart-range-tab-active:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: 4px 11px
  price-delta-up:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.trend-up}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    padding: 2px 8px
  price-delta-down:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.trend-down}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    padding: 2px 8px
  sparkline:
    width: 90px
    height: 28px
  select:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    height: 40px
    padding: 10px 14px
  stepper:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    height: 40px
  card-search:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    height: 44px
    padding: 10px 14px 10px 38px
  card-search-results:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.md}"
  drawer:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.6}"
    width: 420px
  tooltip:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 6px 10px
  tab-underline:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.body}"
    padding: 10px 2px
  tab-underline-active:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    padding: 10px 2px
  pagination-item:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    size: 32px
  pagination-item-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    size: 32px
  skeleton:
    backgroundColor: "{colors.border}"
    rounded: "{rounded.xs}"
  empty-state:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.7}"
  freshness-chip:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  portfolio-hero:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.6}"
  allocation-bar:
    backgroundColor: "{colors.border}"
    rounded: "{rounded.full}"
    height: 12px
  card-frame:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    width: 180px
  position-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.5}"
    width: 280px
  price-alert:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.4}"
  checkbox:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.xs}"
    size: 18px
  radio:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.full}"
    size: 18px
  textarea:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: 10px 14px
    height: 96px
  spinner:
    size: 18px
  card-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.3}"
    width: 200px
  breadcrumbs:
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.body-sm}"
  accordion-item:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    padding: 16px 20px
  banner:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    padding: 12px 24px
  avatar:
    backgroundColor: "{colors.accent-muted}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    size: 40px
  notification-dot:
    backgroundColor: "{colors.error}"
    textColor: "#F5F4F2"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    size: 16px
  auth-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.6}"
    width: 400px
  nav-mobile:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    height: 60px
    padding: 0px 16px
  nav-sheet:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-surface}"
    padding: "{spacing.4}"
  blockquote:
    textColor: "{colors.on-surface}"
    padding: 4px 0px 4px 20px
  code-inline:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.accent}"
    rounded: "{rounded.xs}"
    padding: 1px 6px
  code-block:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.4}"
  progress-bar:
    backgroundColor: "{colors.border}"
    rounded: "{rounded.full}"
    height: 8px
  wizard-step:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    size: 28px
  hero:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-surface}"
    typography: "{typography.display}"
    padding: 64px 0px
  section-header:
    textColor: "{colors.on-surface}"
    typography: "{typography.h2}"
  plan-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.6}"
    width: 280px
  plan-card-featured:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.6}"
    width: 280px
  cta-band:
    backgroundColor: "{colors.brand-950}"
    textColor: "#EAE7E2"
    rounded: "{rounded.lg}"
    padding: "{spacing.8}"
  button-inverted:
    backgroundColor: "#F5F4F2"
    textColor: "#322014"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: 10px 20px
    height: 40px
  popover:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.3}"
    width: 240px
  date-picker:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "{spacing.4}"
    width: 280px
  range-slider:
    backgroundColor: "{colors.border}"
    rounded: "{rounded.full}"
    height: 4px
  copy-button:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface-muted}"
    rounded: "{rounded.xs}"
    size: 28px
  notification-panel:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.md}"
    width: 320px
  notification-item:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    padding: 12px 14px
  button-destructive:
    backgroundColor: "{colors.error}"
    textColor: "#F5F4F2"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: 10px 20px
    height: 40px
  profile-header:
    textColor: "{colors.on-surface}"
    typography: "{typography.h3}"
  rating:
    textColor: "{colors.rarity-rare}"
    typography: "{typography.body-sm}"
  trade-offer:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.5}"
    width: 640px
  trade-timeline:
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
  comment:
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
  settings-section:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.5}"
  danger-zone:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.5}"
  error-page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-surface}"
    padding: "{spacing.9}"
  onboarding-checklist:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.5}"
    width: 360px
  bulk-bar:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: 8px 8px 8px 20px
  filter-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.4}"
    width: 280px
  filter-facet-search:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    height: 32px
    padding: 6px 10px
  sort-control:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    height: 36px
  tag-input:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 6px 8px
---

# Kiri Design System

## Overview

Kiri is a web app that helps collectors track, value, and trade their TCG collection across every game; this is its design language. The name comes from paulownia (kiri), the wood of traditional Japanese chests built to protect valuables, which is exactly what the product does for a collection. Its visual vocabulary: lacquer browns, paper neutrals, gold-leaf bronze, and a bookish serif/sans pairing. The feeling is a well-made card table, not a software dashboard: warm, editorial, artisanal. Cards and collections are treated as physical, precious objects on paper surfaces. It must never drift toward generic SaaS (blue-purple gradients, glassmorphism) and never lean on kitsch-Japanese imagery; the Japanese influence lives in material restraint and naming, not ornament. The written voice matches the visual one: quiet, knowledgeable, collector to collector. Sentence case everywhere except `label` micro-text; no exclamation marks in system messages; empty states name the next action rather than the absence; error messages say what happened and how to fix it, never who to blame.

## Colors

The palette is built from natural materials, named in Japanese: Urushi `primary` (lacquer, near-black brown) is the ink of the system: headings, primary buttons, body text. Kuri (`primary-hover`) warms it on interaction. Haku bronze is the `accent` for links and interactive emphasis; Tsuchi (`accent-muted`) handles decorative fills. Pages sit on Suna sand (`background`) with Kami paper cards (`surface`) one step lighter; depth comes from these warm-neutral steps, not shadows. Semantic states stay earthy: crimson `error` and indigo `info` are fixed brand accents; moss `success` and ochre `warning` are derived to match the palette's desaturated warmth, and `accent-alt` slate-blue is available for categorical coding (card types, formats). Card rarity gets its own six-step ladder: `rarity-common` warm silver, `rarity-uncommon` slate, `rarity-rare` old gold, `rarity-epic` dusty plum, `rarity-mythic` muted copper, `rarity-secret` deep violet. These are traditional TCG foil colors (silver, gold, plum, copper, prismatic) reinterpreted in this palette's desaturated warmth; the gold, plum, copper, and violet are palette extensions, and all carry dark ink except `rarity-secret`, which takes paper text over a muted prismatic gradient (`linear-gradient(100deg, #5C4A6E, #4A5E6D 50%, #7E4E2D)`, violet through deep slate into bronze). Never use saturated primary-color foils; rarity should read like patinaed metal, not candy. Dark mode inverts to deep roasted browns (`background-dark`, `surface-dark`) with light bronze (`primary-dark`) as the action color. The complete tonal ramps are captured as tokens (`brand-50…950` and `neutral-50…950` for light mode, `brand-dark-*` and `neutral-dark-*` for dark (the dark ramps run dark to light), so intermediate steps are always available without inventing values; the semantic tokens above are aliases into these ramps. The brand's signature Haku gradient is captured as four stops (`haku-deep` → `haku-pale`) and rendered as a vertical sheen: `linear-gradient(180deg, haku-bright 0%, haku-pale 42%, haku-mid 78%, haku-deep 100%)`: lightest just above center, sinking to the darkest bronze at the bottom. Use it for cover imagery placeholders, hero backdrops, and anywhere the brand needs its brushed-metal warmth; never rotate it to a diagonal rainbow-style sweep or add non-bronze hues to it. All text pairings meet WCAG AA: Urushi on Kami is ~13:1; muted text (`on-surface-muted`) stays ≥4.5:1 on all surfaces.

## Typography

Two voices: Newsreader (Production Type, free via Google Fonts), an editorial transitional serif, carries all headings with tight negative tracking that gives card names and page titles an editorial, collectible-catalog gravity. It was chosen over paid transitional serifs like Tiempos Text as the closest free equivalent; as a variable font with optical sizing, it stays crisp from 60px display down to 16px `h4`. Geist (Vercel), a clean geometric sans, carries everything functional: body copy, buttons, meta rows, tables. The scale: `display` 60px through `h4` 16px for serif headings, `body-lg` 18px down to `label` 10px for sans. `label` is the workhorse for uppercase micro-text (table headers, badges, section eyebrows), always letter-spaced at 0.04em. Never set headings in Geist or body copy in Newsreader; the pairing is the brand. If Newsreader is unavailable, fall back to a transitional serif stack (Source Serif 4, Georgia, serif), never a slab or display serif.

Formatting rules keep data trustworthy. Card prices always show two decimals ($0.25, $42.00); portfolio aggregates may drop cents once they pass $10,000. Percentages show one decimal (3.2%, never 3% or 3.24%). Timestamps are relative under 24 hours ("12 minutes ago", "2 hours ago"), then "Yesterday", then Month D within the current year, and Month D, YYYY across years. Long card names truncate to one line with an ellipsis in tables and tiles; the full name is always recoverable through the card-preview popover. Numeric table columns align right and use tabular figures.

## Layout

Spacing runs on a 4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96. Density is comfortable-to-generous; editorial white space is part of the brand, so default to `spacing.5` (24px) card padding and `spacing.6`–`spacing.8` between page sections. Content sits in a centered container (max ~1200px) with generous margins; card grids (the core surface of a TCG site) use `spacing.4` (16px) gutters at minimum. Resist packing: a browsing grid of trading cards should breathe like a print catalog, not a spreadsheet. The system is responsive across three breakpoints: mobile below 640px, tablet 640–1024px, desktop above 1024px. Content sits in a 1200px max container with 24px gutters on mobile and 32px from tablet up. Card grids step from 2 columns on mobile to 3 on tablet and 4–5 on desktop; below 900px the header collapses into a hamburger-triggered sheet, and below 640px data tables collapse into stacked card-style rows rather than scrolling horizontally.

## Elevation & Depth

The system is essentially flat. Depth is communicated by warm-neutral surface steps (`background` → `surface` → `surface-raised`) and hairline borders (`border`, strengthening to `border-strong` on hover). Shadows are reserved for the two truly floating layers (modals and toasts), and even there stay soft and brown-tinted (e.g. `0 8px 32px rgba(50,32,20,0.16)`), never gray or harsh. No glows, no glassmorphism, no layered drop shadows on cards at rest. Layering follows a fixed z-index scale: page content 0, sticky header 100, dropdowns and menus 200, drawers 300, modals 400, toasts and banners 500. Nothing else, and nothing in between.

## Shapes

Corner radius scales with component size: `xs` 4px for badges, `sm` 8px for buttons and inputs, `md` 12px for cards and tiles, `lg` 16px for modals, and `full` for chips and pill secondary buttons. The mix is deliberate: rectangular primary buttons feel deliberate and crafted, while pill chips and secondary actions add softness. Never sharp 0px corners on interactive elements, and never over-round cards past `md` (they should echo the proportions of a physical trading card sleeve, not a bubble).

## Components

Buttons come in three weights: `button-primary` is an Urushi-filled rectangle (`rounded.sm`) that hovers to Kuri and disables to `border-strong`; `button-secondary` is a Kami pill (`rounded.full`) with a 1px `border-strong` outline that fills with `border` on hover; `button-ghost` is text-only in `accent` bronze for tertiary actions. `input` sits on `surface-raised` with a 1px `border` that switches to `accent` with a soft 2px bronze ring on focus (`input-focus`); error states swap the ring to `error`. `chip` is a bordered pill for filters and tags; its selected state takes a 12% `accent` wash, an `accent` border, and 500 weight. `badge` is a small Tsuchi-filled rectangle in uppercase `label` type for set and status markers; its Tsuchi fill is an identity color and stays identical in dark mode, while rarity badges use the wash treatment described below and adapt with the theme. `card` is the workhorse: Kami surface, `rounded.md`, hairline border, hovering to `border-strong` with a 2px lift. Content cards, the article and card-catalog units, come in three sizes: `card-featured` (full-bleed cover with the meta row, serif title, and excerpt overlaid in paper text over a dark scrim, plus a "Featured" chip), `card-standard` (cover on top, title and excerpt below), and `card-compact` (cover plus title only). All three share two signature behaviors. First, the caption meta row (date · read time) sits directly on the cover image in paper white. Second, the bottom-right corner is scooped out by a notch: an inverted-radius cutout filled with the page `background` color and smoothed with reverse-curve fillets, so the corner reads as masked away. The notch's leading edge is not a squared step or a round scoop: it rises from the card's bottom edge as a ~20° diagonal (a skewed edge, wider at the bottom than the top) into a short horizontal shelf, finished with small crafted curves: a 14px radius where the diagonal meets the shelf, and 12px reverse fillets where the notch meets the card's bottom and right edges. Never build it with 90° inner corners or an oversized scoop, and construct the cut as one continuous path (a single SVG cap next to a plain filled strip works well); piecing it together from skewed rectangles and gradient fillets leaves hairline seams and clipping artifacts. Don't clip the card with `overflow: hidden` either, or the action pill's bottom edge gets cut by the card's rounded corner; clip only the cover image. The notch houses `card-action`: a bare arrow (→) at rest that, on card hover, expands leftward into a bordered "Read More →" pill (`card-action-hover`, `surface-raised` fill with `border-strong` outline) while the cover image zooms subtly to scale 1.045. The whole card is the hit target. `nav` is a quiet 72px bar on `background` with full-size 16px Geist links, never smaller; nav labels are `body` type, muted (`on-surface-muted`) at rest and darkening to `on-surface` on hover or when active. Dropdown triggers carry a small caret that flips when open, and the bar ends in one compact primary button. An open `dropdown-menu` anchors directly beneath its trigger, left-aligned, floating over the page content on `surface-raised` with the standard shadow. Iconography comes from Lucide (ISC license, free for commercial use): 2px-stroke line icons rendered as inline SVG with `stroke="currentColor"` so they inherit the text color; chevrons are Lucide `chevron-down`, rotated 180° when the menu is open. Icons come in three sizes only: 16px inline with text, 20px in bars and list leads, 24px in feature contexts. TCG-specific symbols that Lucide lacks (mana, energy, set glyphs) are drawn as custom SVGs on the same 24×24 grid at the same 2px stroke. Use one library only: never mix icon sets, and never use filled icons for interface chrome.

Price tracking is a core surface and gets its own component family, rendered with **Lightweight Charts** (TradingView, Apache 2.0) as the charting library. Charts are area/line only (no candlesticks, no bar-chart price history) and stay flat and editorial: a 2px `accent` bronze line over a soft bronze area fade (18% at the line to transparent), hairline horizontal gridlines in `border`, no vertical gridlines, a dashed `on-surface-muted` crosshair with an Urushi tooltip pill in paper text, and Geist `caption` axis labels. The neutral series color is bronze; moss `trend-up` and crimson `trend-down` (aliases of success/error) are reserved for deltas and directional context, never decorative. `price-chart` is the card wrapper: serif card name in muted `h4`, the current price in serif `h2`, a `price-delta-up`/`price-delta-down` badge beside it (12% semantic wash background, the alert recipe, with a small 8px ▲/▼ triangle set as its own flex item, a 5px gap before the value, and 0.02em tracking on the number so decimals stay legible: "3.2%" must never scan as "32%"), `chart-range-tabs` as a segmented pill control (background-colored track, `surface-raised` active segment with `border-strong` outline, uppercase `label` type: 24H / 7D / 30D / 90D / 1Y), and a footer stat row of `label` keys over 500-weight values (avg, low, high for the active window). `sparkline` is the 90×28 inline variant for tables and card rows: single 1.5px polyline in `trend-up`, `trend-down`, or muted bronze for flat, no fill, no axes. The Lightweight Charts theme mapping:

```js
const chart = createChart(el, {
  layout: { background: { color: 'transparent' }, textColor: '#66625F',   // on-surface-muted
            fontFamily: 'Geist, sans-serif', fontSize: 11 },
  grid: { vertLines: { visible: false }, horzLines: { color: '#EAE3D7' } }, // border
  crosshair: { vertLine: { color: '#66625F', style: 2 }, horzLine: { visible: false } },
  timeScale: { borderColor: '#EAE3D7' }, rightPriceScale: { borderVisible: false },
});
const series = chart.addAreaSeries({
  lineColor: '#7E4E2D', lineWidth: 2,                                     // accent
  topColor: 'rgba(126,78,45,.18)', bottomColor: 'rgba(126,78,45,0)',
  crosshairMarkerBackgroundColor: '#7E4E2D',
});
series.setData(variant.priceHistory.map(({ t, p }) => ({ time: t, value: p })));
```

Price data comes from the JustTCG API (`api.justtcg.com/v1`, `x-api-key` header; the key lives in the `JUSTTCG_API_KEY` env var and is only ever used server-side, proxied through the backend). It covers Magic, Pokémon, Yu-Gi-Oh!, and Sorcery among others; each card's `variants[]` (per condition/printing) carries `price`, a daily `priceHistory` array of `{p, t}` points, and 24h/7d/30d/90d change stats with min/max/avg per window; the range tabs map directly onto those windows.

The form kit extends beyond `input`. `select` shares the input anatomy with a trailing Lucide chevron. `stepper` is a 40px three-part control (minus button, tabular-numeral quantity, plus button) separated by hairline dividers on `surface-raised`. `card-search` is the 44px combobox that anchors card intake: a search-icon input opening a `card-search-results` panel of rows (34×47 card thumbnail, 500-weight name, muted set · collector number, rarity badge, right-aligned tabular price), with a designed loading state (three `skeleton` rows) and empty state ("No cards found. Try another game"). Variant selection (condition NM/LP/MP/HP/DMG, printing normal/foil) reuses the segmented-pill pattern from the chart range tabs. `tab-underline` is the page-level tab: 16px labels on a hairline baseline, the active tab in full ink with a 2px `accent` underline. It is distinct from pill range tabs, which are for data windows only. `pagination-item`s are 32px `rounded.xs` squares (Urushi fill on the active page) flanked by chevron prev/next. `tooltip` is an Urushi caption pill with a small arrow. `skeleton` placeholders are `border`-toned bars with a slow paper-toned shimmer, never gray. Every list surface defines an `empty-state`: a tinted icon well, serif `h3` title, muted `body-sm` line, and exactly one primary CTA, all centered; the panel stretches to fill its context's width (min-height 320px) so it reads as the state of the whole surface, never a lost card in a corner. `drawer` is the modal's side-anchored sibling (420px wide, full-height, `surface-raised`, rounded only on its leading edge, behind the same warm scrim) and hosts the add-card flow (search → selected card → language `select` when the card exists in more than one language → variant picker → quantity stepper → cost-basis inputs → footer actions). The condition ladder is always offered in full: a collector's copy exists even when the market has no listing for it, so unpriced versions save with a muted caption and stay out of totals until pricing appears. A kebab (⋮) row-action button opens a compact floating menu whose destructive item is set in `error`.

Beneath these sit the form fundamentals. `checkbox` is an 18px `rounded.xs` box on `surface-raised` with a 1.5px `border-strong` outline that fills Urushi with a paper checkmark when checked; `radio` is its `rounded.full` twin whose checked state keeps the raised fill and adds an 8px Urushi inner dot inside an Urushi ring. `textarea` follows input styling at a 96px minimum height with vertical resize. Every labeled control composes the form-field pattern: an uppercase `label` above, the control, and a muted `caption` help line below; in the error state the border and ring turn `error` and the help line becomes the crimson error message; field errors live at the field, never in a toast or modal. Buttons in a loading state keep their width and swap their label for an 18px `spinner` (2px stroke, currentColor, 0.8s rotation) plus a progress verb ("Adding…"). Keyboard focus is always visible: a 2px `accent` ring at 1–2px offset on every interactive element (inputs, buttons, links, cards, menu items), switching to `error` inside invalid fields. Motion uses three durations only: fast 150ms for hovers and color shifts, medium 300ms for menus, accordions, and drawers, slow 600ms for cover zooms and chart transitions; all ease-out, with the slow tier disabled under `prefers-reduced-motion`. Disabled controls share one treatment: `background` fill, `border` outline, `on-surface-muted` text, no elevation change, and a not-allowed cursor; disabled primary buttons instead fill `border-strong` as specified above. Never fade a whole component with opacity to signal disabled.

Interaction behavior is uniform across the system. Esc closes the topmost floating layer (tooltip, popover, menu, drawer, modal); clicking the scrim closes drawers and non-destructive modals, but destructive confirmations close only by explicit choice. Modals and drawers trap Tab focus and return it to the trigger on close. Menus (dropdown, user menu, kebab) follow the ARIA menu pattern: ArrowUp and ArrowDown cycle items, Home and End jump, Enter activates, and the trigger carries aria-expanded. The card-search combobox follows the ARIA combobox pattern with a listbox popup: arrows move the highlight, Enter selects, Esc clears the popup first and the query second. Segmented pills and underline tabs are tablists (ArrowLeft and ArrowRight move, Home and End jump). The date picker moves focus by day with arrows and by month with PageUp and PageDown; the range slider adjusts with arrows (Shift for 10× steps) and exposes role="slider" with aria-valuenow. Sortable table headers toggle with Enter or Space and expose aria-sort. Toasts are polite live regions that never steal focus, auto-dismiss after five seconds, and pause on hover. Alerts use role="status" for info and success and role="alert" for warning and error; progress bars expose role="progressbar" with current values; pagination and breadcrumbs are nav landmarks with aria-current="page"; skeletons sit aria-hidden inside an aria-busy container; and icon-only buttons (kebab, copy, close, hamburger) always carry an aria-label.

`card-tile` is the workhorse of browse and search grids and the most-rendered component on the site: a `rounded.md` surface panel with 12px padding holding a 63:88 cover at `rounded.sm`, a 500-weight 14px name, a caption set · number line, a `badge-dot` rarity row wearing the game's native rarity name (Mythic Rare, Illustration Rare), and a price row (tabular price left, `price-delta` right). Name and set each truncate to one line with an ellipsis; every fact gets its own line, nothing shares. Hovering lifts the tile 2px, strengthens the border, and reveals a 32px circular Urushi quick-add button over the cover's corner. `breadcrumbs` trace the database drill-down (Game › Set › Card) in `body-sm`: muted links, `border-strong` › separators, current page in 500-weight ink. `accordion-item` rows (a 500-weight 16px question, a rotating chevron, and a muted `body-sm` answer capped at 60ch) stack inside a bordered `rounded.md` panel separated by hairlines, for FAQs, rules text, and collapsible filter groups. `banner` is the page-level system strip sitting full-width under the nav: the alert's wash at 10% with hairline top and bottom borders, square corners, a `body-sm` message with its icon in the semantic color, an optional trailing action link, and a dismiss ✕. Use it for platform-wide notices like delayed price updates. `avatar` comes in 24/32/40/48px and renders the user's photo or two initials on Tsuchi; `user-menu` is the avatar-triggered dropdown with an identity header (avatar, 500-weight name, muted email) above menu items and a sign-out row. `notification-dot` is a 16px crimson counter pill (9px, 600 weight) pinned to the top-right corner of bells and tab icons; the countless variant is a plain 8px dot.

Portfolio surfaces compose these parts. `portfolio-hero` leads the dashboard: an uppercase eyebrow, the total value in serif `h1` with a `price-delta` badge, and the portfolio-wide area chart with range tabs. A `stat-tile` row follows: cost basis, unrealized P&L in trend colors, card count, top mover with inline sparkline. Money is always Geist with `font-variant-numeric: tabular-nums`; gains are prefixed +, losses −, colored `trend-up`/`trend-down`. `allocation-bar` shows value distribution as a 12px fully-rounded stacked bar (segments in bronze `accent`, slate `accent-alt`, plum `rarity-epic`, and gold `rarity-rare`, with 2px paper gaps) above a legend of dot + label + tabular value. The holdings table extends `table-row` with a thumbnail cell, condition chip, quantity, cost, price, a trend-colored P&L column, an inline `sparkline`, and a kebab menu; sortable headers show a chevron on the active sort column, and a filter bar (search input, game `select`, removable filter chips, right-aligned `freshness-chip`) sits above it. Because price data arrives as rate-limited cached snapshots, `freshness-chip` (clock icon plus "Prices updated …") appears on every pricing surface; stale prices are honest prices. `card-frame` is the card-image placeholder at trading-card proportions (63:88, `rounded.md`, `border-strong` hairline). The price matrix is the compact card-page table crossing condition rows with printing columns; every cell is a right-aligned tabular price. Language is a third dimension, never a column: the matrix shows one language at a time, defaulting to English, with other printings (Japanese, Chinese, and so on) behind a compact language `select` beside the section title. The same rule governs the add-card flow and any surface that lists variants. `position-panel` summarizes a holding: label/value rows (quantity, avg cost, market value), P&L emphasized in its trend color, then compact actions. `price-alert` is a single row: $ threshold input, above/below `select`, and a toggle switch.

Bulk operations and discovery complete the data kit. The holdings table gains a leading checkbox column; selecting any row summons `bulk-bar`, a floating Urushi pill pinned bottom-center at the toast layer, holding a 600-weight tabular count, text actions that hover with a soft paper wash, a translucent paper divider, a Remove action tinted toward `error`, and a dismiss ✕; Esc clears the selection. `filter-panel` is the browse page's 280px facet sidebar: a 500-weight header with a muted clear-all link, accordion groups of checkbox facets with muted tabular counts, the rarity ladder as selectable badges (shown only once a game is chosen, wearing that game's native rarity names, since every game names its tiers differently), and the price `range-slider`; on mobile it becomes a full-height drawer summoned by a Filters chip that shows the active-filter count. Long facet lists (card sets run to the hundreds) get `filter-facet-search`, a 32px mini input inside the group above a scrollable checkbox list capped at 240px; facet rows keep their muted tabular counts and truncate long labels to one line with an ellipsis (full name on hover), the scroll area reserves a stable gutter so labels never touch the scrollbar, and a group that depends on another selection (sets need a game) shows a muted caption hint until it applies. Inside a mobile drawer the panel stretches to full width. `sort-control` pairs a compact select (a muted "Sort:" prefix before the 500-weight field name) with a bordered direction toggle that flips between ↑ and ↓; grids use it where tables use sortable headers. `tag-input` collects freeform labels: a `surface-raised` field holding selected values as small removable chips with inline text entry, where Enter or comma commits, Backspace removes the last chip, and suggestions reuse the combobox results panel. Comparison charts overlay a second series in `accent-alt` slate over the bronze primary, never more than two series; a legend row of colored dots, 500-weight names, and tabular current values sits above the chart, and the shared crosshair tooltip lists both values.

Account surfaces use `auth-card`: a 400px `surface` panel at `rounded.lg` centered on the page background, holding a serif `h2` welcome, full-width provider buttons in the secondary style, an "or" divider of hairlines with a muted caption, stacked email and password form fields, a full-width primary submit, and one muted footer link. Never more than one primary action per card. `wizard-steps` guides multi-stage flows like bulk import and onboarding: 28px numbered circles joined by hairline connectors that stop 6px short of each circle and never cross them, where completed steps fill Urushi with a paper check, the current step is outlined in `accent` with ink text, and upcoming steps stay muted on `surface-raised`; caption labels sit beneath each circle. `progress-bar` is the determinate loader: an 8px `border`-toned track with a `rounded.full` `accent` fill, a `body-sm` label on the left, and a tabular count or percent on the right. Article prose gains three more blocks: `blockquote` (a 22px serif pull quote with a 3px `accent` left rule and a muted caption attribution), `code-inline` (mono text on `surface-raised` with a hairline border and `accent` ink), and `code-block` (mono `body-sm` on `surface-raised` at `rounded.md` with 16px padding, scrolling horizontally rather than wrapping); figures set the image in a `rounded.md` frame with a centered muted caption beneath.

Mobile is a first-class rendering, not an afterthought. Below 900px the header becomes `nav-mobile`: a 60px bar with the wordmark, the bell with its `notification-dot`, and a hamburger. Tapping it opens `nav-sheet`, a full-screen `background` panel where the links restack as 22px serif rows separated by hairlines, followed by the secondary and primary buttons side by side at full width. Drawers become full-width bottom-anchored sheets on mobile; modals cap their width at calc(100vw − 32px). Below 640px the holdings table collapses into stacked rows, each rendered as a `surface` card: thumbnail, name and set with the condition chip and quantity, then price and P&L on a third line, with the kebab pinned top-right. Touch targets never drop below 44px. Horizontal scrolling is reserved for code blocks and, when unavoidable, wide tables inside their own scroll container; the page itself never scrolls sideways.

Marketing surfaces compose the same tokens. `hero` opens public pages: an outlined chip eyebrow, a `display` serif headline, a `body-lg` muted subhead on a 55ch measure, and a CTA pair (one primary, one secondary pill), all left-aligned on `background` with generous vertical padding. `section-header` starts each landing section: uppercase `label` eyebrow, serif `h2` title, an optional muted intro, and an optional trailing `accent` action link on the baseline. `plan-card` presents pricing: serif `h3` plan name, muted `body-sm` description, serif `h2` price with a muted per-month caption, a hairline rule, a checklist of `body-sm` features with 15px `accent` bronze checks, and a full-width CTA. The featured tier sits on `surface-raised` with an `accent` border and a bronze "Most popular" pill, and it alone carries a primary button; the monthly/annual toggle reuses the segmented pill. `cta-band` closes pages: the footer's dark `brand-950` dot-grid treatment at `rounded.lg`, a centered serif `h2` in paper, one line of muted cream, and `button-inverted` (paper fill, Urushi text). The inverted button exists only for dark bands and is used nowhere else.

`popover` is the generic anchored floating panel: `surface-raised`, `rounded.md`, hairline border, the floating shadow, and a small arrow toward its trigger. Its flagship use is the card preview: hovering any card name (marked with a dotted `accent` underline) reveals a 63:88 thumbnail beside the name, set line with rarity badge, and price with delta. `date-picker` is a 280px calendar panel: a 500-weight month title between chevron buttons, `label` weekday initials, and 32px day cells at `rounded.xs` that hover to `border`, with today outlined in `accent`, the selected day filled Urushi, and adjacent-month days muted to `border-strong`. `range-slider` handles numeric filters like price ranges: a 4px `border` track with an `accent` filled span and two 16px `surface-raised` thumbs outlined in `border-strong`, the active range echoed as tabular text beside the label. `copy-button` is a 28px ghost square with the Lucide copy icon that swaps to a moss check for two seconds after copying; pair it with deck lists, share links, and API keys. `notification-panel` opens from the bell: a 320px `surface-raised` panel with a header row (500-weight title, muted mark-all-read link), rows of a tinted icon tile, a 600-weight title line, a muted `body-sm` detail line that never repeats the title, and a caption timestamp, where unread rows carry a `background` tint and an 8px `accent` dot pinned to the row's top-right corner, aligned with the first text line, closed by a centered `accent` view-all link.

Community and trading surfaces build on the same kit. `profile-header` opens a trader's page: a 64px avatar, serif `h3` name beside a `rating` row, a muted caption meta line (member since, completed trades), and compact actions. `rating` renders five 15px stars in `rarity-rare` old gold with `border-strong` outlines for empty stars, followed by a tabular value and count; gold belongs to stars and rarity only, never to interactive elements. `trade-offer` is the two-sided exchange card: "You give" and "You get" columns of card rows (thumbnail, 500-weight name, condition chip, tabular value) with per-side totals over a strong hairline, a circled swap glyph between the columns, and a `price-delta` showing the value gap; the footer holds the status chip and the action pair, where Accept is the only primary button. `trade-timeline` tracks fulfillment vertically: 20px dots joined by hairline connectors that stop short of each dot, completed steps filled Urushi with paper checks, the current step outlined in `accent`, each row a 500-weight stage name over a caption timestamp. `comment` rows pair a 32px avatar with a 500-weight name, caption timestamp, `body-sm` body, and caption action links; replies indent 42px behind a hairline rule, and the composer is an `input` beside a compact primary button.

Settings pages use `settings-section`: a two-column band with the serif `h4` section title and a muted caption description on the left, and a bordered `surface` card of form fields on the right, closed by a right-aligned compact primary Save. The API key row lives in these cards: an uppercase label, the masked key in `code-inline`, a `copy-button`, and a ghost Regenerate. `danger-zone` is always the last section of a settings page: a `surface` card whose border is a 35% `error` mix, holding a 500-weight title, a muted warning line, and `button-destructive` (`error` fill, paper text). Destructive buttons appear only in danger zones and confirmation modals, and destructive actions always confirm through a modal before executing. `error-page` centers on `background`: an uppercase `label` eyebrow naming the code, a serif `h1` message written in the product's voice, one muted line, and a single primary button home; 404 and 500 share the template. `onboarding-checklist` welcomes new users: a 500-weight title with a tabular step count, a `progress-bar`, then task rows where completed tasks show an Urushi check circle with muted struck-through text and the next task carries 500-weight ink with a trailing chevron; the card is dismissable once every task completes.

`footer` is the site's dark anchor: a `brand-950` (#2B1C13) panel that stays dark in both light and dark modes, textured with a faint paper dot grid (`radial-gradient(rgba(245,244,242,.06) 1px, transparent 1.5px)` tiled at 22px). The left block carries the serif wordmark in cream, a serif tagline at ~80% cream, and a row of small social icons; to its right run link columns, each led by a 16px serif heading in full cream with sans links below at ~62% cream opacity, brightening to full cream on hover. A language selector (globe icon, label, chevron) takes the final column. The bottom row is a single muted serif caption, "© … All rights reserved.", with generous space above it and no divider rule; the texture does the work. Tables pair an uppercase `table-header` with `table-row`s separated by hairline borders. `stat-tile` shows a serif `h2` number (4px of air below it) over a `label` caption, deltas in a sub line. `alert` is a `rounded.sm` card whose background takes a wash of its semantic color: `color-mix(in srgb, semantic 12%, surface)` for the fill and a 35% mix of the semantic color for the 1px border. Text stays `on-surface`; only the inline icon carries the full semantic color. Never fill an alert with the raw saturated semantic color, and don't add side or bottom border accents; the wash is the signal. The settings billing card leads with the plan name in 500-weight text beside its action, and on the free tier fills with usage meters: `progress-bar`s of live counts against the caps (Portfolio 4/100, Active alerts 1/1), muted name left, tabular count right; paid tiers drop the meters for the portal link. The `danger-card` keeps its copy on a 48ch measure with the destructive button vertically centered against the copy block across a full `spacing.6` gap; text and button never crowd. Alerts stretch to their container's width; contexts, not the component, decide how wide they run. `toast` inverts to Urushi with paper text; `modal` floats on `surface-raised` at `rounded.lg` behind a warm scrim (`rgba(26,18,14,0.5)`).

Rarity badges (`badge-rarity-*`) share the base badge anatomy (uppercase `label` type, `rounded.xs`, 2×8 padding) but wear their tier as a tinted wash rather than a solid fill: the background is `color-mix(in srgb, tier 14%, surface)`, the 1px border a 40% mix of the tier, and the text a 70% mix of the tier into `on-surface` so it stays legible while carrying the hue. Because the wash mixes against `surface`, rarity badges adapt to dark mode automatically. Dense contexts (tables, result lists, card-tile meta lines) use the `badge-dot` variant instead: an 8px tier-colored dot beside a muted uppercase label, no box at all. The ladder is game-agnostic: each supported TCG maps its own rarity names onto the tiers by prestige, so a site covering several games stays visually consistent. `badge-rarity-secret` may render its wash as a muted prismatic gradient (violet through slate into bronze, each at the same 18% mix) for extra ceremony. Never use solid saturated fills for rarity.

| Game | Tier mapping |
|---|---|
| Magic: The Gathering | Common → `common` · Uncommon → `uncommon` · Rare → `rare` · Mythic Rare → `mythic` |
| Pokémon | Common → `common` · Uncommon → `uncommon` · Rare → `rare` · Ultra Rare → `epic` · Illustration Rare → `mythic` · Hyper Rare → `secret` |
| Yu-Gi-Oh! | Common → `common` · Rare → `uncommon` · Super Rare → `rare` · Ultra Rare → `mythic` · Secret Rare → `secret` |
| Warlord | Common → `common` · Uncommon → `uncommon` · Rare → `rare` |
| Sorcery: Contested Realm | Ordinary → `common` · Exceptional → `uncommon` · Elite → `rare` · Unique → `mythic` |

Navigation menus follow two dropdown patterns. `dropdown-trigger` is a secondary-style pill with a caret. `dropdown-menu` is a `surface-raised` panel at `rounded.lg` with the floating shadow and no internal padding; each `dropdown-item` is a full-width row (an icon tile, a 600-weight title, and a muted `body-sm` description) whose hover state fills the row with `border` beige and recolors both the title and icon to that item's categorical accent (`info`, `error`, or `accent-alt`), with the icon gaining a thin accent-outlined tile. `mega-menu` is the two-column variant: equal columns split by a hairline rule, each led by an uppercase `label` eyebrow, holding bold group headings with muted link items that hover to a soft `border`-filled `rounded.xs` pill.

Article pages use the editorial stack directly: serif headings, 16px Geist body on a roughly 65-character measure, links underlined in the text color (hover shifts them to `accent`), and numbered lists with generous leading. The article sidebar has three widgets: `author-card` (48px circular avatar, 500-weight name, muted caption role), `sidebar-list` (an uppercase `label` eyebrow over a hairline rule, then muted `body-sm` links that darken on hover), and `cta-card` (a bordered `surface` panel at `rounded.lg` with a short title, muted description, and a compact primary button). `feature-card` presents product capabilities: a tinted illustration well (`border`-tone beige holding a miniature UI vignette on a floating `surface-raised` mini-panel) above a caption band with a 20px serif title and muted `body-sm` description; the card stays flat with a hairline border, letting the vignette's soft shadow carry the depth.

## Do's and Don'ts

**Do:**
- Set every heading in Newsreader and every functional string in Geist; the serif/sans pairing is the brand.
- Build depth from surface steps and hairline borders; keep shadows for modals and toasts only.
- Keep the paper-and-lacquer warmth everywhere: warm neutrals, brown-tinted shadows, earthy semantic colors.
- Use `label` (10px, 0.04em, uppercase) for all micro-text: table headers, badges, eyebrows, meta.
- Give card grids catalog-like breathing room: 24px padding, 16px+ gutters, generous section spacing.
- Use the accent set (`error` crimson, `info` indigo, `accent-alt` slate) as categorical coding for card types and rarities.

**Don't:**
- Don't use blue-purple gradients, glassmorphism, neon glows, or any generic-SaaS styling.
- Don't introduce cold pure grays or stark `#FFFFFF`; every neutral must carry the warm cast.
- Don't stack heavy shadows or saturate accents; the system is quiet and flat by design.
- Don't use kitsch-Japanese ornament: no cherry blossoms, torii gates, or brush-script fonts; the influence stays in material and restraint.
- Don't set headings in Geist, body in Newsreader, or introduce a third typeface.
- Don't over-round: cards cap at `rounded.md`, buttons at `rounded.sm` (pills are only for chips and secondary buttons).
