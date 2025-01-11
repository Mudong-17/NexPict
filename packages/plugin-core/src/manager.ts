import { PluginConfigure } from "./configure";
import { PluginDownloader } from "./downloader";
import { PluginExecutor } from "./executor";
import { PluginLoader } from "./loader";
import { Plugin } from "./types";

// 插件管理器核心
export class PluginManager {
  private readonly downloader: PluginDownloader;
  private readonly loader: PluginLoader;
  private readonly configure: PluginConfigure;
  private readonly executor: PluginExecutor;
  private readonly loaded: Map<string, Plugin>;

  constructor() {
    this.downloader = new PluginDownloader();
    this.loader = new PluginLoader();
    this.configure = new PluginConfigure();
    this.executor = new PluginExecutor();
    this.loaded = new Map();
  }

  async loadAndConfigurePlugin(
    pluginPath: string,
    config?: any
  ): Promise<Plugin> {
    try {
      const plugin = await this.loader.loadPlugin(pluginPath);

      if (!this.loader.validatePlugin(plugin)) {
        throw new Error("Invalid plugin format");
      }

      const pluginId = this.loader.getPluginId(pluginPath);

      // 使用默认配置或提供的配置
      const finalConfig =
        config || this.configure.getDefaultConfig(plugin.configSchema);
      await this.configure.setPluginConfig(pluginId, finalConfig, plugin);

      this.loaded.set(pluginId, plugin);
      return plugin;
    } catch (error) {
      throw new Error(`Failed to load plugin: ${error.message}`);
    }
  }
}
