import { describe, it, expect } from "vitest";
import { pickAgentNames } from "./names.js";

describe("pickAgentNames", () => {
  it("returns the requested number of names", () => {
    const names = pickAgentNames(3, "/nonexistent/path");
    expect(names).toHaveLength(3);
  });

  it("returns unique names", () => {
    const names = pickAgentNames(5, "/nonexistent/path");
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(5);
  });

  it("returns at most the requested count", () => {
    const names = pickAgentNames(10, "/nonexistent/path");
    expect(names.length).toBeLessThanOrEqual(10);
  });
});
