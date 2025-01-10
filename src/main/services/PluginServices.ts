import { ipcMethod } from '../decorators/ipcMethod'
import { PluginManager } from '../plugins'

const pluginManager = new PluginManager()

export class PluginServices {
  @ipcMethod
  async download({ url }) {
    try {
      await pluginManager.downloadPlugin(url)
      return { code: 200 }
    } catch (error) {
      throw error
    }
  }

  @ipcMethod
  async fetchAll() {
    const result = pluginManager.getLoadedPlugins()
    return result
  }

  @ipcMethod
  async saveConfig({ pluginId, config }) {
    try {
      pluginManager.savePluginConfig(pluginId, config)
      return { code: 200 }
    } catch (error) {
      throw error
    }
  }

  @ipcMethod
  async fetchConfig({ pluginId }) {
    const plugin = pluginManager.getPlugin(pluginId)
    return plugin.config
  }

  @ipcMethod
  async fetchResources({ pluginId }) {
    const resources = pluginManager.getResource(pluginId)
    return resources
  }

  @ipcMethod
  async uploadFile({ pluginId, file }) {
    try {
      return await pluginManager.ExecPlugin(pluginId, file)
    } catch (error) {
      throw error
    }
  }

  @ipcMethod
  async deletePlugin({ pluginId }) {
    try {
      pluginManager.deletePlugin(pluginId)
      return { code: 200 }
    } catch (error) {
      throw error
    }
  }

  @ipcMethod
  async deleteResource({ pluginId, resource }) {
    try {
      pluginManager.deleteResource(pluginId, resource)
      return { code: 200 }
    } catch (error) {
      throw error
    }
  }
}
