import { homedir } from "os";
import { join } from "path";
import { mkdirSync, existsSync } from "fs";

/**
 * Get the root cspwn directory (~/.cspwn)
 */
export function getCspwnRoot(): string {
  return join(homedir(), ".cspwn");
}

/**
 * Get the repos directory (~/.cspwn/repos)
 */
export function getReposDir(): string {
  return join(getCspwnRoot(), "repos");
}

/**
 * Get the path for a specific repo by hash (~/.cspwn/repos/<hash>)
 */
export function getRepoPath(repoHash: string): string {
  return join(getReposDir(), repoHash);
}

/**
 * Get the bare repo path (~/.cspwn/repos/<hash>/bare)
 */
export function getBareRepoPath(repoHash: string): string {
  return join(getRepoPath(repoHash), "bare");
}

/**
 * Get the worktrees directory (~/.cspwn/repos/<hash>/worktrees)
 */
export function getWorktreesDir(repoHash: string): string {
  return join(getRepoPath(repoHash), "worktrees");
}

/**
 * Get a specific worktree path (~/.cspwn/repos/<hash>/worktrees/<name>)
 */
export function getWorktreePath(repoHash: string, agentName: string): string {
  return join(getWorktreesDir(repoHash), agentName);
}

/**
 * Get the queues directory (~/.cspwn/queues)
 */
export function getQueuesDir(): string {
  return join(getCspwnRoot(), "queues");
}

/**
 * Get the queue file for a specific repo (~/.cspwn/queues/<hash>.json)
 */
export function getQueuePath(repoHash: string): string {
  return join(getQueuesDir(), `${repoHash}.json`);
}

/**
 * Get the IPC directory (~/.cspwn/ipc)
 */
export function getIpcDir(): string {
  return join(getCspwnRoot(), "ipc");
}

/**
 * Get the IPC directory for a specific repo (~/.cspwn/ipc/<hash>)
 */
export function getRepoIpcDir(repoHash: string): string {
  return join(getIpcDir(), repoHash);
}

/**
 * Ensure all required cspwn directories exist
 */
export function ensureCspwnDirs(): void {
  const dirs = [getCspwnRoot(), getReposDir(), getQueuesDir(), getIpcDir()];

  for (const dir of dirs) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }
}

/**
 * Ensure repo-specific directories exist
 */
export function ensureRepoDirs(repoHash: string): void {
  const dirs = [getRepoPath(repoHash), getWorktreesDir(repoHash)];

  for (const dir of dirs) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }
}
