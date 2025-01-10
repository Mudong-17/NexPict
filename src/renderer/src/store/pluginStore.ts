import { storage } from '@renderer/utils';
import { create } from 'zustand';

import { persist } from 'zustand/middleware';

interface PluginStore {
  plugins: any[];
  pluginOptions: () => { label: string; value: string }[];
  pluginConfigSchema: (id: string) => any;
  fetchPluginConfig: (id: string) => Promise<any>;
  fetchPlugins: (forceRefresh?: boolean) => Promise<void>;
  fetchPluginResources: (id: string) => Promise<any>;
}

export const usePluginStore = create<PluginStore>()(
  persist(
    (set, get) => ({
      plugins: [],
      pluginOptions: () => {
        return get().plugins.map((plugin) => ({ label: plugin.metadata.name, value: plugin.id }));
      },
      pluginConfigSchema: (id) => {
        return get().plugins.find((plugin) => plugin.id === id)?.configSchema;
      },
      fetchPluginConfig: async (id) => {
        const config = await window.electron.invoke<any>('PluginServices:fetchConfig', {
          pluginId: id,
        });
        return config;
      },
      fetchPlugins: async (forceRefresh = false) => {
        // 如果已有插件且不强制刷新，就不重复获取
        if (!forceRefresh && get().plugins.length > 0) {
          return;
        }
        const plugins = await window.electron.invoke<any>('PluginServices:fetchAll');
        console.log('🚀 ~ fetchPlugins: ~ plugins:', plugins);
        set({ plugins });
      },
      fetchPluginResources: async (id: string) => {
        const resources = await window.electron.invoke<any>('PluginServices:fetchResources', {
          pluginId: id,
        });
        return resources;
      },
    }),
    {
      name: 'plugin-store',
      storage,
    },
  ),
);
