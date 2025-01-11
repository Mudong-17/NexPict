// const pluginManager = new PluginManager()

export class PluginServices {
  async download({ url }) {
    try {
      // await pluginManager.downloadPlugin(url)
      return { code: 200 };
    } catch (error) {
      throw error;
    }
  }

  async fetchAll() {
    // const result = pluginManager.getLoadedPlugins()
    return [];
  }

  async saveConfig({ pluginId, config }) {
    // try {
    //   pluginManager.savePluginConfig(pluginId, config)
    //   return { code: 200 }
    // } catch (error) {
    //   throw error
    // }
  }

  async fetchConfig({ pluginId }) {
    // const plugin = pluginManager.getPlugin(pluginId)
    // return plugin.config
  }

  async fetchResources({ pluginId }) {
    // const resources = pluginManager.getResource(pluginId)
    // return resources
  }

  async uploadFile({ pluginId, file }) {
    try {
      // return await pluginManager.ExecPlugin(pluginId, file)
    } catch (error) {
      throw error;
    }
  }

  async deletePlugin({ pluginId }) {
    try {
      // pluginManager.deletePlugin(pluginId)
      return { code: 200 };
    } catch (error) {
      throw error;
    }
  }

  async deleteResource({ pluginId, resource }) {
    try {
      // pluginManager.deleteResource(pluginId, resource)
      return { code: 200 };
    } catch (error) {
      throw error;
    }
  }
}
