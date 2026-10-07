const PROTECTED_SERVERS = new Set(["cinesrc", "nova", "vale"]);

export const supportsRedirectProtection = (server: string) => PROTECTED_SERVERS.has(server);

// Omit popup and top-navigation permissions; the cross-origin player may
// still run scripts, submit forms, and present video while confined to its frame.
export const playerSandbox = (server: string, enabled: boolean) =>
  enabled && supportsRedirectProtection(server)
    ? "allow-scripts allow-same-origin allow-forms allow-presentation"
    : undefined;