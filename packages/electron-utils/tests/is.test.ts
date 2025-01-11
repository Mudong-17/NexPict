import { describe, it, expect, vi } from "vitest";

const mockApp = vi.hoisted(() => ({
  isPackaged: false,
}));

vi.mock("electron", () => ({
  app: mockApp,
}));

import { is } from "../src/is";

describe("is", () => {
  it("should detect dev environment", () => {
    vi.stubGlobal("process", {
      ...process,
      env: { NODE_ENV: "development" },
    });
    expect(is.dev).toBe(true);
  });
});
