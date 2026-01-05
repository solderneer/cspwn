#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import { App } from "./app.js";

const cli = meow(
  `
  Usage
    $ cspwn [count] [options]     Spawn Claude agents (default command)
    $ cspwn <command> [options]

  Commands
    [count]          Spawn agents (default: 1)
    ls               List existing agents
    rm <agent>       Remove a specific agent
    pr               Prune all agents for current repository
    cl               Close tabs and remove agents for current repository

  Spawn Options
    -a, --agent      Reuse an existing agent (mutually exclusive with count)
    -t, --terminal   Force terminal type (kitty, iterm)
    -b, --branch     Base branch for worktrees (default: current)
    -T, --task       Task description for branch naming
    -n, --no-notify  Disable completion notifications
    --dry-run        Show what would be done without executing

  List Options (ls)
    --all            List agents across all repositories

  Remove Options (rm)
    -f, --force      Skip confirmation prompt

  Prune Options (pr)
    --all            Prune agents across all repositories
    -f, --force      Skip confirmation prompt

  Clean Options (cl)
    -t, --terminal   Force terminal type (kitty, iterm)
    -f, --force      Skip confirmation prompt

  Examples
    $ cspwn                         # Spawn 1 agent
    $ cspwn 3                       # Spawn 3 agents
    $ cspwn -a alice                # Reuse agent alice
    $ cspwn -T "fix auth bug"       # New agent with fix/ branch
    $ cspwn ls                      # List agents for current repo
    $ cspwn ls --all                # List all agents
    $ cspwn rm alice                # Remove agent alice
    $ cspwn pr                      # Prune all agents (current repo)
    $ cspwn pr --all -f             # Prune all agents everywhere
    $ cspwn cl                      # Close tabs and remove agents
    $ cspwn cl -f                   # Skip confirmation
`,
  {
    importMeta: import.meta,
    flags: {
      terminal: {
        type: "string",
        shortFlag: "t",
      },
      branch: {
        type: "string",
        shortFlag: "b",
      },
      task: {
        type: "string",
        shortFlag: "T",
      },
      agent: {
        type: "string",
        shortFlag: "a",
      },
      all: {
        type: "boolean",
        default: false,
      },
      force: {
        type: "boolean",
        shortFlag: "f",
        default: false,
      },
      notify: {
        type: "boolean",
        shortFlag: "n",
        default: true,
      },
      dryRun: {
        type: "boolean",
        default: false,
      },
    },
  }
);

const [command = "spawn", ...args] = cli.input;

render(<App command={command} args={args} flags={cli.flags} />);
