import { describe, expect, it } from "vitest";
import { playerSandbox, supportsRedirectProtection } from "../lib/playerRedirectProtection";

describe("player redirect protection", () => {
  for (const server of ["cinesrc", "nova", "vale", "smashystreams", "dumbo"]) {
    it(`restricts redirects on ${server} only when enabled`, () => {
      expect(supportsRedirectProtection(server)).toBe(true);
      expect(playerSandbox(server, false)).toBeUndefined();
      const permissions = playerSandbox(server, true)?.split(" ");
      expect(permissions).toEqual(["allow-scripts", "allow-same-origin", "allow-forms", "allow-presentation"]);
      expect(permissions).not.toContain("allow-popups");
      expect(permissions).not.toContain("allow-top-navigation");
    });
  }
  it("leaves other providers unsandboxed", () => {
    for (const server of ["vidbolt", "crimson", "helix", "astra", "ironclad", "lumen"]) {
      expect(supportsRedirectProtection(server)).toBe(false);
      expect(playerSandbox(server, true)).toBeUndefined();
    }
  });
});