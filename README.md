# tmd-editor

**A plugin to manage and edit workout .tmd files in a convenient custom interface.**

---

## Features

- Custom workout editor with support for:
  - Adding, deleting, and editing exercises and sets
  - Autosave
  - Parsing and serializing the .tmd format
- Context menu:
  - Create a new tmd file from template (default name is the current date)
  - Duplicate a .md file as .tmd in one click
- Delete and edit exercises with confirmation dialogs
- Rename the file directly from the editor, with emoji support and quick date insertion

---

## CI build

Use the project CI entrypoint to install dependencies from `package-lock.json`
and build the plugin:

```bash
npm run ci:build
```

The command runs `scripts/ci-build.sh`, which executes `npm ci` and
`npm run build`.

GitHub Actions uses the same entrypoint:

- pull requests to `main` run a build check and upload `dist/main.js` plus
  `dist/manifest.json` as an artifact;
- pushes to `main` bump the patch version in `manifest.json`, `package.json`,
  and `package-lock.json`, then build and create a release with the built
  plugin files attached.

---

## Screenshots

- **Main Editor**

[SCREENSHOT: main editor interface]

- **Context menu with create/duplicate buttons**

[SCREENSHOT: Context menu]

- **Exercise deletion dialog**

[SCREENSHOT: exercise deletion confirmation dialog]

- **Edit exercise name dialog**

[SCREENSHOT: exercise name edit dialog]

- **File rename dialog with emoji and date**

[SCREENSHOT: file rename dialog]

## Feedback

Feel free to send your suggestions and feedback — the plugin is actively developed! 