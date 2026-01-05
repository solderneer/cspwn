import { execa } from "execa";

export interface LaunchOptions {
  name: string;
  cwd: string;
  command: string;
}

export async function launchITermTab(options: LaunchOptions): Promise<void> {
  // Use escape sequence to set tab title, then run command
  // \e]1;title\a sets the tab/icon title in iTerm2
  const script = `
    tell application "iTerm2"
      tell current window
        create tab with default profile
        tell current session
          write text "printf \\"\\\\e]1;Claude [${options.name}]\\\\a\\"; export CLAUDECTL_AGENT='${options.name}'; cd '${options.cwd}' && ${options.command}"
        end tell
      end tell
    end tell
  `;

  await execa("osascript", ["-e", script]);
}

export async function isITermAvailable(): Promise<boolean> {
  try {
    const result = await execa("osascript", [
      "-e",
      'tell application "System Events" to (name of processes) contains "iTerm2"',
    ]);
    return result.stdout.trim() === "true";
  } catch {
    return false;
  }
}

/**
 * Close iTerm2 sessions/tabs by matching worktree paths
 * Sends Ctrl+C to interrupt Claude Code, then "exit" to close shell
 * @param worktreePaths - List of worktree directory paths to match
 */
export async function closeITermSessions(worktreePaths: string[]): Promise<number> {
  if (worktreePaths.length === 0) return 0;

  // Build path check conditions
  const pathChecks = worktreePaths.map((p) => `sessionPath starts with "${p}"`).join(" or ");

  const script = `
tell application "iTerm2"
  set closedCount to 0
  repeat with aWindow in windows
    repeat with aTab in tabs of aWindow
      repeat with aSession in sessions of aTab
        try
          tell aSession
            set sessionPath to (variable named "session.path")
            if ${pathChecks} then
              tell aTab to close
              set closedCount to closedCount + 1
            end if
          end tell
        end try
      end repeat
    end repeat
  end repeat
  return closedCount
end tell
`;

  try {
    const result = await execa("osascript", ["-e", script]);
    return parseInt(result.stdout.trim(), 10) || 0;
  } catch {
    return 0;
  }
}
