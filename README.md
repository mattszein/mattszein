# mattszein.com

Personal website that simulates a Pop!_OS Linux desktop with Neovim (LazyVim) open. Instead of clicking, visitors navigate content using vim-style keyboard bindings — `h/j/k/l`, `w/b`, `0/$`, `g/G` — with a blinking cursor that moves through the text.

## Tech Stack

- **Next.js 15** with React 19 and TypeScript
- **MDX** for content pages
- **Zustand** for state management
- **Tailwind CSS** for styling
- **react-hotkeys-hook** for keyboard event handling
- **grapheme-splitter** for proper Unicode/emoji cursor positioning

## Key Decisions

- **DOM-based cursor**: The cursor is a `<span>` injected into text nodes, splitting and merging them as it moves. This gives pixel-accurate positioning that matches the browser's own text rendering.
- **Grapheme clusters**: Cursor movement operates on grapheme clusters (visual characters) rather than JavaScript string indices, so emojis and combining characters are treated as single units.
- **No mouse interaction**: All navigation is keyboard-driven, mimicking the real Neovim experience.

## Development

```bash
docker compose up
```

Opens at [http://localhost:3000](http://localhost:3000).
