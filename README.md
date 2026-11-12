# iTweak Store — Rebuilt

A new browser-based reconstruction of the 2012 iTweak Store concept. Blue gradient toolbars, pinstriped backgrounds, glossy icons, grouped lists, and a responsive layout bring the original visual direction to modern browsers.

## Project history

The original iTweak Store was described as a browser-based alternative to Cydia. [iDownloadBlog's March 1, 2012 interview](https://www.idownloadblog.com/2012/03/01/itweak-store-interview/) identifies Casey (@CaseyTal) as a member of the original team.

The original code was never publicly released and is no longer available to this project. This repository begins in November 2026 and contains a new implementation, developed with AI assistance from screenshots and public descriptions. It is not recovered historical code and does not inherit the original project's adoption, contributors, or maintenance history. Historical involvement is not evidence that the earlier project was open source.

## What works

- Responsive browsing with featured entries, newest-first sorting, and six genres.
- Search by package name, description, author, and category.
- Package detail dialogs with keyboard access and optional HTTPS project links.
- Saved collections persisted locally in the browser.
- Interactive theme colors and quick-switch previews.
- Import and export of a documented JSON catalog, plus collection export.
- An About page, reconstruction news, and app release notes.
- No third-party runtime dependencies, analytics, accounts, or network APIs.

The 12 bundled entries are **fictional sample packages**, clearly labeled in the interface. They are not downloadable or installable iOS software. The app does not jailbreak devices, install Debian packages, connect to APT repositories, manage payments, or update installed software. A production package manager would need a separately designed device bridge, authenticated package metadata, integrity checks, repository support, and compatibility testing.

## Run locally

Requires Node.js 20+ for tests/build and Python 3 for the example HTTP server. No npm install is needed.

```sh
npm test
npm run build
npm start
```

Open http://127.0.0.1:4173. JavaScript modules require serving over HTTP; do not open `index.html` directly with `file://`.

You may also serve the repository root directly with `python3 -m http.server 4173 --bind 127.0.0.1`. Deploy the contents of `dist/` to any static host. Routes use URL hashes, so no server rewrite rules are required.

## Bring your own catalog

Open **About → Manage catalog** (or **Your catalog** in the desktop sidebar). Export the example, edit it, and import the JSON file. Import replaces the currently active browser-local catalog; export it first if you need a backup. Restoring the demo removes the imported catalog but keeps saved IDs.

```json
{
  "schemaVersion": 1,
  "name": "My projects",
  "packages": [{
    "id": "example-project",
    "name": "Example Project",
    "category": "Utilities",
    "tagline": "A short summary of the project.",
    "description": "Describe what it actually does.",
    "author": "Project contributors",
    "version": "0.1.0",
    "added": "2026-11-12",
    "homepage": "https://example.com/project",
    "icon": "folder",
    "color": "blue",
    "featured": true,
    "demo": false
  }]
}
```

- Categories: `Themes`, `Tweaks`, `Utilities`, `System`, `Multimedia`, `Widgets`.
- Required: `id`, `name`, `category`, `tagline`, `description`.
- Optional: `author`, `version`, `added`, `homepage`, `icon`, `color`, `featured`, `demo`.
- IDs: unique lowercase letters, digits, dots, underscores, and hyphens; 80 characters maximum.
- Limits: 500 entries; file smaller than 1 MB; field lengths enforced by `core.mjs`.
- Homepage links must use HTTPS. Imported metadata is not independently verified.
- Icons: `gear`, `paint`, `sliders`, `star`, `folder`, `music`, `bolt`, `clock`, `cloud`, `grid`, `heart`.
- Colors: `violet`, `blue`, `orange`, `steel`, `pink`, `green`, `night`, `gold`.

Imports and favorites are stored under `itweak-rebuilt-v1` in localStorage. They remain on that browser and origin; clearing browser data removes them. The application sends no catalog data to a backend. Storage failures leave the app usable for the current visit and display a notice. HTML in imported text is escaped and executable link protocols are rejected.

## Contributing

Start with a small issue describing the change. Keep demo content explicitly marked, preserve keyboard and mobile accessibility, and avoid implying device capabilities that are not implemented. Run `npm test` and `npm run build` before submitting a pull request. Check the relevant behavior in a browser at desktop and mobile widths.

Useful next steps include documenting and implementing a real repository metadata adapter, adding verified open-source project listings, and extending browser integration tests. Device installation would be a separate, substantial project.

## Files

- `index.html`, `styles.css`: layout, visual system, original SVG icon symbols.
- `app.mjs`: navigation, dialogs, local persistence, import/export, and previews.
- `catalog.mjs`: fictional sample entries and genres.
- `core.mjs`: catalog validation, escaping, filtering, and serialization.
- `core.test.mjs`: tests for validation, filtering, and unsafe input handling.
- `build.mjs`: copies the six static application assets to `dist/`.

## License

New code and original SVG/CSS artwork in this repository are MIT licensed; see [LICENSE](LICENSE). Third-party names and trademarks remain with their respective owners. No original source code, Apple image assets, or reference screenshots are distributed in this repository.
