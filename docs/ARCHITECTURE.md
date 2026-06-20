# Saans2 — Architecture (Phase 1)

Plain HTML / CSS / JS rebuild. Deploy to GitHub Pages at `/Saans2/`.

## Shell types (`data-shell` on `<body>`)

| Shell   | Header | Footer | Bottom nav | Chat bubble |
|---------|--------|--------|------------|-------------|
| public  | yes    | yes    | no         | no          |
| auth    | yes    | no     | no         | no          |
| app     | yes + settings | no | yes    | yes         |

## Adding page 20

1. Copy `docs/PAGE-TEMPLATE.html`
2. Set `data-shell` and `data-page`
3. Put content in `#app-root` only
4. Add translation keys to `js/translations.js` (never array indices)
5. Use `data-i18n="key.id"` on static text

## Script load order

See bottom of `docs/PAGE-TEMPLATE.html` — always load `bootstrap.js` last.

## Config

Edit `js/config.js` — `BASE_PATH`, Firebase (Phase 2), GA ID (optional).

## Phases

- **Phase 1** ✓ Shell, i18n, tokens, template
- **Phase 2** Login, onboarding, full dashboard
- **Phase 3–7** See project brief
