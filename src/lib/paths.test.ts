import { describe, it, expect } from "vitest";
import { homedir } from "os";
import { join } from "path";
import {
  getCspwnRoot,
  getReposDir,
  getRepoPath,
  getBareRepoPath,
  getWorktreesDir,
  getWorktreePath,
  getQueuesDir,
  getQueuePath,
  getIpcDir,
  getRepoIpcDir,
} from "./paths.js";

describe("paths", () => {
  const home = homedir();
  const root = join(home, ".cspwn");

  describe("getCspwnRoot", () => {
    it("returns ~/.cspwn", () => {
      expect(getCspwnRoot()).toBe(root);
    });
  });

  describe("getReposDir", () => {
    it("returns ~/.cspwn/repos", () => {
      expect(getReposDir()).toBe(join(root, "repos"));
    });
  });

  describe("getRepoPath", () => {
    it("returns ~/.cspwn/repos/<hash>", () => {
      expect(getRepoPath("abc123")).toBe(join(root, "repos", "abc123"));
    });
  });

  describe("getBareRepoPath", () => {
    it("returns ~/.cspwn/repos/<hash>/bare", () => {
      expect(getBareRepoPath("abc123")).toBe(join(root, "repos", "abc123", "bare"));
    });
  });

  describe("getWorktreesDir", () => {
    it("returns ~/.cspwn/repos/<hash>/worktrees", () => {
      expect(getWorktreesDir("abc123")).toBe(join(root, "repos", "abc123", "worktrees"));
    });
  });

  describe("getWorktreePath", () => {
    it("returns ~/.cspwn/repos/<hash>/worktrees/<name>", () => {
      expect(getWorktreePath("abc123", "alice")).toBe(
        join(root, "repos", "abc123", "worktrees", "alice")
      );
    });
  });

  describe("getQueuesDir", () => {
    it("returns ~/.cspwn/queues", () => {
      expect(getQueuesDir()).toBe(join(root, "queues"));
    });
  });

  describe("getQueuePath", () => {
    it("returns ~/.cspwn/queues/<hash>.json", () => {
      expect(getQueuePath("abc123")).toBe(join(root, "queues", "abc123.json"));
    });
  });

  describe("getIpcDir", () => {
    it("returns ~/.cspwn/ipc", () => {
      expect(getIpcDir()).toBe(join(root, "ipc"));
    });
  });

  describe("getRepoIpcDir", () => {
    it("returns ~/.cspwn/ipc/<hash>", () => {
      expect(getRepoIpcDir("abc123")).toBe(join(root, "ipc", "abc123"));
    });
  });
});
