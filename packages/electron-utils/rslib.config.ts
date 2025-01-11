import { defineConfig } from "@rslib/core";

export default defineConfig({
  tools: {
    bundlerChain: (chain) => {
      chain.externals({
        electron: "commonjs2 electron",
      });
    },
  },
  lib: [
    {
      format: "esm",
      syntax: "es2021",
      dts: true,
    },
    {
      format: "cjs",
      syntax: "es2021",
    },
  ],
});
