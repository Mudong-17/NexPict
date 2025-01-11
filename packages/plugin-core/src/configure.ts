import { Plugin, ConfigSchemaField } from "./types";

export class PluginConfigure {
  private configs: Map<string, any> = new Map();

  // 验证配置值是否符合 schema 定义
  validateConfig(
    schema: Record<string, ConfigSchemaField>,
    config: any
  ): boolean {
    for (const [key, field] of Object.entries(schema)) {
      // 检查必填字段
      if (
        field.required &&
        (config[key] === undefined || config[key] === null)
      ) {
        return false;
      }

      if (config[key] !== undefined) {
        // 根据类型验证
        switch (field.type) {
          case "number":
            if (typeof config[key] !== "number") return false;
            if (field.min !== undefined && config[key] < field.min)
              return false;
            if (field.max !== undefined && config[key] > field.max)
              return false;
            break;
          case "boolean":
            if (typeof config[key] !== "boolean") return false;
            break;
          case "select":
            if (!field.options?.some((opt) => opt.value === config[key]))
              return false;
            break;
        }
      }
    }
    return true;
  }

  // 设置插件配置
  async setPluginConfig(
    pluginId: string,
    config: any,
    plugin: Plugin
  ): Promise<void> {
    // 验证配置
    if (!this.validateConfig(plugin.configSchema, config)) {
      throw new Error(`Invalid config for plugin: ${pluginId}`);
    }

    // 保存配置
    this.configs.set(pluginId, config);

    // 调用插件的 configure 方法
    await plugin.configure(config);
  }

  // 获取插件配置
  getPluginConfig(pluginId: string): any {
    return this.configs.get(pluginId);
  }

  // 获取配置的默认值
  getDefaultConfig(
    schema: Record<string, ConfigSchemaField>
  ): Record<string, any> {
    const defaults: Record<string, any> = {};
    for (const [key, field] of Object.entries(schema)) {
      if (field.default !== undefined) {
        defaults[key] = field.default;
      }
    }
    return defaults;
  }
}
