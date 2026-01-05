# cspwn
<p align="left">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/platform-macOS-lightgrey" alt="Platform">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
</p>


**Quickly spawn multiple Claude Code instances within a git repo.**
After reading through the recent [@bcherny](https://x.com/bcherny/status/2007179832300581177) convos on using Claude Code effectively, I tried running multiple Claude Code instances and realised how tedious it it is to spin up multiple CC instances in their own git trees. So I automated the process, with a couple of quality of life features.


## Features

- **Git worktrees** - Agents share a single `.git` directory, saving disk space and spawn time
- **Auto branch naming** - Agents get branches like `feat/alice-work` or `fix/betty-fix-auth`
- **Memorable agent names** - Names like `betty`, `felix`, `grace` instead of numbers
- **Docker-style management** - `ls`, `rm`, and `pr` commands to manage agents
- **Terminal support** - Works with Kitty and iTerm2
- **Central storage** - All worktrees live in `~/.cspwn/`, keeping your project clean

## Installation

```bash
# Clone and install
git clone https://github.com/solderneer/cspwn.git
cd cspwn
npm install
npm run build
npm link
```

## Usage

### Spawn Claude agents

```bash
# Spawn 1 agent (default)
cspwn

# Spawn 3 agents
cspwn 3

# Spawn with task description (auto-generates branch names)
cspwn --task "fix auth bug"
# Creates: fix/alice-fix-auth-bug

# Reuse an existing agent
cspwn --agent alice

# Reuse agent with a new task (creates new branch)
cspwn --agent alice --task "add unit tests"

# Use a specific base branch
cspwn --branch develop

# Preview without executing
cspwn --dry-run
```

### List agents

```bash
# List agents for current repository
cspwn ls

# List all agents across all repositories
cspwn ls --all
```

### Remove agents

```bash
# Remove a specific agent (with confirmation)
cspwn rm alice

# Force remove without confirmation
cspwn rm alice -f
```

### Prune all agents

```bash
# Remove all agents for current repository
cspwn pr

# Remove all agents everywhere
cspwn pr --all

# Skip confirmation
cspwn pr -f
```

### Close and clean up

```bash
# Close terminal tabs and remove all agents for current repository
cspwn cl

# Skip confirmation
cspwn cl -f
```

## Example Output

### Spawning new agents

```
cspwn
Claude worktree spawner

v1.0.0

Spawning 3 Claude agents in Kitty

[alice]   ✓ Running
          ↳ feat/alice-work
[betty]   ✓ Running
          ↳ feat/betty-work
[felix]   ⠋ Creating worktree...
```

### Listing agents

```
Found 3 agents

solderneer/cspwn (a1b2c3d4)
  alice         feat/alice-work          2h ago
  betty         fix/betty-fix-auth       1d ago
  felix         feat/felix-add-tests     3d ago
```

## Options

### Spawn (default command)

```
-a, --agent <name>      Reuse an existing agent
-t, --terminal <type>   Force terminal (kitty, iterm)
-b, --branch <name>     Base branch for worktrees (default: current)
-T, --task <desc>       Task description for branch naming
-n, --no-notify         Disable macOS notifications
--dry-run               Preview without executing
```

### List (ls) / Prune (pr)

```
--all                   Apply to all repositories
-f, --force             Skip confirmation (rm/pr/cl only)
```

## How it works

1. Detects your git repository and remote URL
2. Creates a bare repo at `~/.cspwn/repos/<hash>/bare/`
3. For each agent:
   - Picks an unused agent name from the pool
   - Generates a branch name based on agent name and task
   - Creates a fresh worktree at `~/.cspwn/repos/<hash>/worktrees/<name>/`
4. Opens each in a new terminal tab with Claude Code running

When reusing an existing agent (`--agent`):

- The existing worktree is preserved
- If `--task` is provided, a new branch is created and checked out
- Without `--task`, continues on the current branch

### Directory Structure

```
~/.cspwn/
└── repos/
    └── a1b2c3d4/              # Repo hash (from remote URL)
        ├── bare/              # Shared bare git repo
        └── worktrees/
            ├── alice/         # feat/alice-work
            ├── betty/         # fix/betty-fix-auth
            └── felix/         # feat/felix-add-tests
```

## Requirements

- macOS
- Git
- [Claude Code](https://claude.ai/download) installed
- Kitty or iTerm2 terminal

## Development

```bash
npm install
npm run build
npm run dev       # Watch mode
npm run test      # Run tests
npm run lint      # Lint code
```

## License

MIT
