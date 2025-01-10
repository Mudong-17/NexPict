import { is } from '@electron-toolkit/utils';
import { app } from 'electron';
import fs from 'fs-extra';
import { nanoid } from 'nanoid';
import path from 'path';
import { pathToFileURL } from 'url';
import { DEV_USER_DATA } from '../share';
import { createLogger, pluginStore } from '../utils';

const pluginsPath = is.dev ? path.join(DEV_USER_DATA, 'plugins') : path.join(app.getPath('userData'), 'plugins');
const logger = createLogger('plugin-manager');

fs.ensureDirSync(pluginsPath);

export class PluginManager {
  loadedPlugins: Map<any, any>;
  pluginsDir: string;
  constructor() {
    logger.info('Initializing PluginManager');
    this.pluginsDir = pluginsPath;
    this.loadedPlugins = new Map();
    this.loadPluginsFromDisk();
  }

  async downloadPlugin(url) {
    logger.info(`Downloading plugin from: ${url}`);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const error = `Failed to download plugin: ${response.status} ${response.statusText}`;
        logger.error(error);
        throw new Error(error);
      }
      const pluginCode = await response.text();
      const pluginPath = path.join(pluginsPath, `${nanoid()}.mjs`);

      fs.writeFileSync(pluginPath, pluginCode);
      logger.info(`Plugin downloaded and saved to: ${pluginPath}`);
      this.loadPluginsFromDisk();
      return pluginPath;
    } catch (error) {
      logger.error('Error downloading plugin:', error);
      throw error;
    }
  }

  private validatePlugin(plugin: any) {
    return plugin && plugin.metadata && plugin.metadata.type === 'uploader';
  }

  async loadPlugin(pluginPath) {
    logger.info(`Loading plugin from: ${pluginPath}`);
    try {
      if (!fs.existsSync(pluginPath)) {
        const error = `Plugin file not found: ${pluginPath}`;
        logger.error(error);
        throw new Error(error);
      }

      const absolutePath = path.resolve(pluginPath);
      if (!absolutePath.startsWith(this.pluginsDir)) {
        const error = '插件必须位于指定目录内';
        logger.error(error);
        throw new Error(error);
      }

      const fileUrl = pathToFileURL(absolutePath).href;
      const module = await import(fileUrl);
      const plugin = module.default;

      if (!this.validatePlugin(plugin)) {
        const error = `Invalid plugin: ${pluginPath}`;
        logger.error(error);
        throw new Error(error);
      }

      const pluginId = path.basename(pluginPath, '.mjs');
      this.loadedPlugins.set(pluginId, plugin);
      logger.info(`Plugin loaded successfully: ${pluginId}`);

      const pluginConfigs = pluginStore.get('pluginConfigs') || {};
      if (pluginConfigs[pluginId]) {
        plugin.configure(pluginConfigs[pluginId]);
        logger.info(`Restored config for plugin: ${pluginId}`);
      }

      return plugin;
    } catch (error) {
      logger.error(`Error loading plugin from ${pluginPath}:`, error);
      throw error;
    }
  }

  async loadPluginsFromDisk() {
    logger.info('Loading plugins from disk');
    const pluginFiles = fs.readdirSync(this.pluginsDir).filter((file) => path.extname(file) === '.mjs');
    logger.info(`Found ${pluginFiles.length} plugin files`);

    const loadedPluginIds = Array.from(this.loadedPlugins.keys());
    const unloadedPlugins = pluginFiles.filter((file) => {
      const pluginId = path.basename(file, '.mjs');
      return !loadedPluginIds.includes(pluginId);
    });

    for (const id of loadedPluginIds) {
      if (!pluginFiles.includes(`${id}.mjs`)) {
        this.loadedPlugins.delete(id);
        logger.info(`Removed uninstalled plugin: ${id}`);
      }
    }

    for (const file of unloadedPlugins) {
      try {
        await this.loadPlugin(path.join(this.pluginsDir, file));
      } catch (error) {
        logger.error(`Failed to load plugin ${file}:`, error);
      }
    }

    pluginStore.set('plugins', Array.from(this.loadedPlugins.keys()));
    logger.info('Finished loading plugins from disk');
  }

  savePluginConfig(pluginId: string, config: any) {
    const plugin = this.loadedPlugins.get(pluginId);
    if (!plugin) {
      throw new Error(`插件 ${pluginId} 未找到`);
    }
    plugin.configure(config);
    // 1. 读取已有配置
    const pluginConfigs: Record<string, any> = pluginStore.get('pluginConfigs') || {};
    // 2. 更新当前插件配置
    pluginConfigs[pluginId] = config;
    // 3. 写回本地
    pluginStore.set('pluginConfigs', pluginConfigs);
  }

  async getLoadedPlugins() {
    await this.loadPluginsFromDisk();
    return Array.from(this.loadedPlugins.entries()).map(([id, plugin]) => ({
      id,
      metadata: {
        name: plugin.metadata.name,
        version: plugin.metadata.version,
        description: plugin.metadata.description,
        author: plugin.metadata.author,
        type: plugin.metadata.type,
      },
      configSchema: plugin.configSchema,
    }));
  }

  async ExecPlugin(pluginId: string, file: any) {
    logger.info(`Executing plugin: ${pluginId}`);
    const plugin = this.getPlugin(pluginId);
    if (!plugin) {
      const error = 'Plugin not found';
      logger.error(error);
      throw new Error(error);
    }

    const ctx = { input: file, output: null };
    try {
      if (plugin.beforePipe) await plugin.beforePipe(ctx);
      if (plugin.pipe) await plugin.pipe(ctx);
      if (plugin.beforeUpload) await plugin.beforeUpload(ctx);
      await plugin.upload(ctx);
      if (plugin.afterUpload) await plugin.afterUpload(ctx);

      const pluginResource = pluginStore.get('resources') || {};
      if (!pluginResource[pluginId]) pluginResource[pluginId] = [];
      pluginResource[pluginId].push(ctx.output);
      pluginStore.set('resources', pluginResource);

      logger.info(`Plugin ${pluginId} executed successfully`);
      return { code: 200, result: ctx.output };
    } catch (error) {
      logger.error(`Error executing plugin ${pluginId}:`, error);
      throw error;
    }
  }

  async deleteResource(pluginId: string, resource: any) {
    const plugin = this.getPlugin(pluginId);
    if (!plugin) throw new Error('Plugin not found');
    await plugin.deleteResource(resource);
    // 1. 读取已有资源
    const resources = (pluginStore.get(`resources.${pluginId}`) as any[]) || [];
    // 2. 更新当前资源
    pluginStore.set(
      `resources.${pluginId}`,
      resources.filter((i: any) => i.url !== resource.url),
    );
  }

  deletePlugin(pluginId: string) {
    // 删除插件文件
    const pluginPath = path.join(this.pluginsDir, `${pluginId}.mjs`);
    fs.removeSync(pluginPath);
    // 删除插件配置
    pluginStore.delete(`pluginConfigs.${pluginId}`);
    // 删除插件资源
    pluginStore.delete(`resources.${pluginId}`);
    // 删除插件实例
    this.loadedPlugins.delete(pluginId);
    // 更新插件列表
    pluginStore.set('plugins', Array.from(this.loadedPlugins.keys()));
  }

  getPlugin(id: string) {
    return this.loadedPlugins.get(id);
  }

  getResource(id: string) {
    return pluginStore.get(`resources.${id}`) || [];
  }
}
