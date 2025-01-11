import { describe, it, expect, vi, beforeEach } from "vitest";

const mockApp = vi.hoisted(() => ({
  setAppUserModelId: vi.fn(),
  getLoginItemSettings: vi.fn(() => ({
    openAtLogin: false,
    openAsHidden: false,
    wasOpenedAtLogin: false,
    wasOpenedAsHidden: false,
    restoreState: false,
  })),
  setLoginItemSettings: vi.fn(),
}));

vi.mock("electron", () => ({
  app: mockApp,
  BrowserWindow: vi.fn(),
}));

import { APP } from "../src/app";

describe("APP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("setAutoLaunch", () => {
    it("should return false on Linux", () => {
      vi.stubGlobal("process", { ...process, platform: "linux" });
      expect(APP.setAutoLaunch(true)).toBe(false);
    });
  });
});
