import path from "path";
import { pathToFileURL } from "url";
import { Plugin } from "./types";

// 插件加载器
export class PluginLoader {
  // private readonly logger = createLogger('plugin-loader');

  async loadPlugin(pluginPath: string): Promise<Plugin> {
    const fileUrl = pathToFileURL(path.resolve(pluginPath)).href;
    const module = await import(fileUrl);
    return module.default;
  }

  validatePlugin(plugin: any): plugin is Plugin {
    return plugin && typeof plugin.upload === "function";
  }

  getPluginId(pluginPath: string): string {
    return path.basename(pluginPath, ".mjs");
  }
}
