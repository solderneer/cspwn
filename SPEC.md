# cspwn Specification

## Overview

cspwn (claude-spawn) is a Claude worktree spawner for macOS. It enables parallel Claude Code instances working on the same codebase, each in isolated git worktrees.

---

## Architecture

```
~/.cspwn/
└── repos/
    └── <repo-hash>/           # SHA256 of normalized remote URL (8 chars)
        ├── bare/              # Bare git repository (shared)
        └── worktrees/
            ├── alice/         # Worktree on feat/alice-work
            ├── betty/         # Worktree on fix/betty-fix-auth
            └── felix/         # Worktree on feat/felix-add-tests
```

### Key Design Decisions

1. **Git Worktrees over Clones**: Single shared `.git` directory, near-instant agent creation
2. **Central Location**: `~/.cspwn/` keeps project directories clean
3. **Repo Hashing**: Remote URL is normalized and hashed to identify repos uniquely
4. **Auto Branch Naming**: Branches follow `type/agent-description` convention

---

## How It Works

1. User runs `cspwn 3` in any git repository
2. cspwn identifies the repo by hashing its remote URL
3. Creates/reuses a bare repo at `~/.cspwn/repos/<hash>/bare/`
4. For each agent:
   - Picks an unused agent name from the pool
   - Generates a branch name (e.g., `feat/alice-work`)
   - Creates a fresh worktree at `~/.cspwn/repos/<hash>/worktrees/<name>/`
5. Launches terminal tabs (Kitty/iTerm) with Claude Code in each worktree

### Agent Instance Behavior

**Default (Always New)**: By default, `cspwn` always creates new agent instances with fresh worktrees. This ensures clean state and avoids contamination from previous sessions.

**Explicit Reuse**: To reuse an existing agent, specify it with `--agent`:

```bash
cspwn --agent alice              # Reuse alice, assign new task/branch
cspwn --agent alice --task "..."  # Reuse alice with new branch for task
```

When reusing an agent:

- The existing worktree is preserved
- A new branch is created and checked out (if --task provided)
- Without --task, continues on current branch

### Branch Naming

Branches are auto-generated based on agent name and optional task:

```bash
cspwn                           # feat/alice-work
cspwn --task "fix auth bug"     # fix/alice-fix-auth-bug
cspwn --task "add unit tests"   # test/alice-add-unit-tests
```

Branch type is inferred from task keywords:

- `fix`, `bug`, `issue` → `fix/`
- `test` → `test/`
- `doc`, `readme` → `docs/`
- `refactor` → `refactor/`
- `chore`, `cleanup` → `chore/`
- Default → `feat/`

---

## Commands

### spawn (default)

```bash
cspwn [count] [options]
```

Spawn multiple Claude agents in terminal tabs. Always creates new agent instances by default.

**Options:**

- `-a, --agent <name>` - Reuse an existing agent (creates new branch if --task provided)
- `-t, --terminal <type>` - Force terminal (kitty, iterm)
- `-b, --branch <name>` - Base branch for worktrees (default: current)
- `-T, --task <desc>` - Task description for branch naming
- `-n, --no-notify` - Disable macOS notifications
- `--dry-run` - Preview without executing

**Examples:**

```bash
cspwn                          # Spawn 1 agent
cspwn 5                        # Spawn 5 agents
cspwn --task "fix auth bug"    # New agent with fix/ branch
cspwn --branch develop         # New agent based on develop
cspwn --agent alice            # Reuse existing alice agent
cspwn --agent alice --task "new feature"  # Reuse alice, new branch
```

---

### ls

```bash
cspwn ls [options]
```

List all existing Claude agent instances for the current repository.

**Options:**

- `--all` - List agents across all repositories

**Examples:**

```bash
cspwn ls                           # List agents for current repo
cspwn ls --all                     # List all agents across all repos
```

**Output:**

```
Found 3 agents

solderneer/cspwn (a1b2c3d4)
  alice     feat/alice-work          2h ago
  betty     fix/betty-fix-auth       1d ago
  felix     feat/felix-add-tests     3d ago
```

---

### rm

```bash
cspwn rm <agent> [options]
```

Remove a specific Claude agent instance and its worktree.

**Options:**

- `-f, --force` - Force deletion without confirmation

**Examples:**

```bash
cspwn rm alice                   # Remove alice (with confirmation)
cspwn rm alice -f                # Remove without confirmation
```

---

### pr

```bash
cspwn pr [options]
```

Prune (remove) all Claude agent instances for the current repository.

**Options:**

- `--all` - Prune agents across all repositories
- `-f, --force` - Force deletion without confirmation

**Examples:**

```bash
cspwn pr                          # Remove all agents for current repo
cspwn pr --all                    # Remove all agents everywhere
cspwn pr -f                       # Skip confirmation
```

---

### cl

```bash
cspwn cl [options]
```

Close terminal tabs and remove all Claude agent instances for the current repository.

**Options:**

- `-t, --terminal <type>` - Force terminal (kitty, iterm)
- `-f, --force` - Force deletion without confirmation

**Examples:**

```bash
cspwn cl                          # Close tabs and remove agents
cspwn cl -f                       # Skip confirmation
```

---

## Implementation Details

### Repo Identification

Remote URLs are normalized before hashing:

- `git@github.com:user/repo.git` → `github.com/user/repo`
- `https://github.com/user/repo.git` → `github.com/user/repo`

This ensures the same repo is identified regardless of clone method.

### Worktree Management

```typescript
// Create worktree
await createWorktree({
  repoHash: "a1b2c3d4",
  agentName: "alice",
  branchName: "feat/alice-work",
  baseBranch: "main",
});

// Check if worktree exists
const exists = await worktreeExists(repoHash, agentName);

// List all worktrees for a repo
const worktrees = await listWorktrees(repoHash);
```

### Agent Names

Names are drawn from a pool of memorable names: alice, betty, felix, grace, etc.

- New names are picked randomly from unused pool (names not currently in use)
- Use `--agent <name>` to explicitly reuse an existing agent
- Use `cspwn ls` to see which agents are currently in use

---

## Future Considerations

The following features were considered but deferred to keep the initial implementation simple:

- **Task Queue**: Queue tasks for agents to pull from
- **Agent Communication**: MCP server for agent-orchestrator communication
- **Monitor Mode**: Live TUI dashboard showing all agents

These can be added later if the basic worktree-based spawning proves useful.

---

## References

- [Git Worktrees Documentation](https://git-scm.com/docs/git-worktree)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
