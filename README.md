# tmd-editor

**A plugin to manage and edit workout .tmd files in a convenient custom interface.**

---

## Features

- Custom workout editor with support for:
  - Adding, deleting, and editing exercises and sets
  - Autosave
  - Parsing and serializing the .tmd format
- Obsidian context menu:
  - Create a new tmd file from template (default name is the current date)
  - Duplicate a .md file as .tmd in one click
- Delete and edit exercises with confirmation dialogs
- Rename the file directly from the editor, with emoji support and quick date insertion

---

## Screenshots

- **Main Editor**

[SCREENSHOT: main editor interface]

- **Context menu with create/duplicate buttons**

[SCREENSHOT: Obsidian context menu]

- **Exercise deletion dialog**

[SCREENSHOT: exercise deletion confirmation dialog]

- **Edit exercise name dialog**

[SCREENSHOT: exercise name edit dialog]

- **File rename dialog with emoji and date**

[SCREENSHOT: file rename dialog]

---

## Installation

1. Download and build the plugin (or use a ready-made main.js).
2. Place the files in your vault's `.obsidian/plugins/tmd-obsidian-plugin` folder.
3. Enable the plugin in Obsidian settings.

---

## .tmd Format Example

```
[[Workout Name]]
Workout comment
### Squats
| Weight | Reps |
| ------ | ---- |
| 60     | 10   |
| 70     | 8    |
|        |      |
```

---

## Feedback

Feel free to send your suggestions and feedback — the plugin is actively developed! 