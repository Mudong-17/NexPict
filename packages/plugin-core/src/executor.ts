import { Plugin, PluginContext } from "./types";

// 插件执行器
export class PluginExecutor {
  // private readonly logger = createLogger('plugin-executor');

  async execute(plugin: Plugin, file: any): Promise<any> {
    const ctx: PluginContext = { input: file, output: null };
    const steps = [
      { name: "beforePipe", fn: plugin.beforePipe },
      { name: "pipe", fn: plugin.pipe },
      { name: "beforeUpload", fn: plugin.beforeUpload },
      { name: "upload", fn: plugin.upload },
      { name: "afterUpload", fn: plugin.afterUpload },
    ];

    for (const step of steps) {
      if (step.fn) await step.fn.call(plugin, ctx);
    }

    return ctx.output;
  }
}
