import React from "react";
import { Box, Text } from "ink";
import { SpawnCommand } from "./commands/spawn.js";
import { ListCommand } from "./commands/list.js";
import { DeleteCommand } from "./commands/delete.js";
import { PruneCommand } from "./commands/prune.js";
import { CleanCommand } from "./commands/clean.js";
import { Header } from "./components/Header.js";

export interface AppProps {
  command: string;
  args: string[];
  flags: {
    terminal?: string;
    branch?: string;
    task?: string;
    agent?: string;
    all: boolean;
    force: boolean;
    notify: boolean;
    dryRun: boolean;
  };
}

// New short command names
const KNOWN_COMMANDS = ["spawn", "ls", "rm", "pr", "cl"];

export function App({ command, args, flags }: AppProps) {
  // If command is a number, treat it as spawn count
  const isNumericCommand = /^\d+$/.test(command);
  const effectiveCommand = isNumericCommand ? "spawn" : command;
  const effectiveArgs = isNumericCommand ? [command, ...args] : args;

  const isKnownCommand = KNOWN_COMMANDS.includes(effectiveCommand);

  return (
    <Box flexDirection="column">
      <Header />
      {effectiveCommand === "spawn" && (
        <SpawnCommand
          count={effectiveArgs[0] ? parseInt(effectiveArgs[0], 10) : 1}
          terminal={flags.terminal as "kitty" | "iterm" | undefined}
          branch={flags.branch}
          task={flags.task}
          agent={flags.agent}
          notify={flags.notify}
          dryRun={flags.dryRun}
        />
      )}
      {effectiveCommand === "ls" && <ListCommand all={flags.all} />}
      {effectiveCommand === "rm" && (
        <DeleteCommand agentName={effectiveArgs[0] || ""} force={flags.force} />
      )}
      {effectiveCommand === "pr" && <PruneCommand all={flags.all} force={flags.force} />}
      {effectiveCommand === "cl" && (
        <CleanCommand
          force={flags.force}
          terminal={flags.terminal as "kitty" | "iterm" | undefined}
        />
      )}
      {!isKnownCommand && (
        <Box marginTop={1}>
          <Text color="red">Unknown command: {command}</Text>
          <Text dimColor> Run 'cspwn --help' for usage.</Text>
        </Box>
      )}
    </Box>
  );
}
