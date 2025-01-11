import { defineConfig } from "@rsbuild/core";
import { ChildProcess, spawn } from "child_process";
import { join } from "path";
let electronProcess: ChildProcess | null = null;

function startElectron() {
  electronProcess?.kill();
  electronProcess = spawn("electron", ["."], {
    stdio: "inherit",
  });
}

export default defineConfig({
  resolve: {
    alias: {
      "@": "./src",
    },
  },
  output: {
    filenameHash: false,
    target: "node",
  },
  source: {
    entry: {
      index: "./src/index.ts",
      preload: "./src/preload.ts",
    },
  },
  tools: {
    bundlerChain: (chain) => {
      chain.externals({
        electron: "electron",
      });
    },
  },
  plugins: [
    {
      name: "electron-reload",
      setup(api) {
        api.onAfterBuild(({ isWatch }) => {
          if (isWatch) {
            startElectron();
          }
        });
      },
    },
  ],
});
