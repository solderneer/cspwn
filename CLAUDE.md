# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build      # Build with tsup (outputs to dist/)
npm run dev        # Watch mode for development
npm run typecheck  # Type check without emitting
npm run lint       # Run ESLint
npm run lint:fix   # Fix lint errors and format with Prettier
npm run test       # Run tests once
npm run test:watch # Run tests in watch mode
```

After building, test locally with:

```bash
node bin/claudectl.js spawn --dry-run
node bin/claudectl.js --help
```

To install globally for testing:

```bash
npm link
claudectl spawn 3
```

## Conventions

### Branch Naming

```
type/short-description
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

Examples: `feat/add-tmux-support`, `fix/terminal-detection`

### PR and Commit Messages

```
type: short description
```

Examples: `feat: add tmux terminal support`, `fix: correct iTerm2 tab naming`

## Architecture

This is a React-based terminal UI application using [Ink](https://github.com/vadimdemedes/ink) (React for CLIs).

### Entry Flow

```
bin/claudectl.js → src/cli.tsx (meow arg parsing) → src/app.tsx (routes to commands)
```

### Key Layers

**Commands** (`src/commands/`)

- `spawn.tsx` - Main command: clones repo N times, launches Claude in terminal tabs
- `init.tsx` - Generates CLAUDE.md by analyzing project type

**Components** (`src/components/`)

- Ink/React components for terminal UI (spinners, progress indicators)
- `AgentProgress.tsx` - Per-agent status display with name, status, spinner

**Lib** (`src/lib/`)

- `terminal/` - Terminal detection and tab launching (Kitty via `kitten @`, iTerm via AppleScript)
- `git.ts` - Git operations: clone, reset, branch detection
- `names.ts` - Agent name pool and selection logic (prefers reusing existing)
- `notifications.ts` - macOS notifications via osascript

### Key Patterns

- **Agent names**: Uses memorable names (betty, felix, grace) instead of numbers. Names are persisted in folder names (`claude/betty/`) and reused across sessions.
- **Smart reuse**: If `claude/<name>/` exists, resets repo instead of re-cloning (faster). Use `--clean` to force fresh clones.
- **Terminal abstraction**: `LaunchOptions` interface with `name`, `cwd`, `command` - implementations for Kitty and iTerm2.

### State Management

SpawnCommand uses React hooks with phases: `init` → `spawning` → `done`. Agent state tracks `name`, `status`, `isReused`, `error`.
