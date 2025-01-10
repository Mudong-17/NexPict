import { create } from 'zustand';

interface AppStore {
  name: string;
  version: string;
  locale: string;
  country: string;
  platform: string;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  fetchAppInfo: () => Promise<void>;
}

export type AppInfo = Pick<AppStore, 'name' | 'version' | 'locale' | 'country' | 'platform' | 'darkMode'>;

const createDarkModeSlice = (set) => ({
  darkMode: false,
  setDarkMode: async (darkMode: boolean) => {
    await window.electron.invoke('AppServices:setUserConfig', { key: 'darkMode', value: darkMode });
    set({ darkMode });
  },
});

export const useAppStore = create<AppStore>((set) => ({
  name: 'NexPict',
  version: '',
  locale: '',
  country: '',
  platform: '',
  ...createDarkModeSlice(set),

  fetchAppInfo: async () => {
    const appInfo = await window.electron.invoke<AppInfo>('AppServices:getAppInfo');
    set(appInfo);
  },
}));

// export const useDarkMode = () => useAppStore((state) => [state.darkMode, state.setDarkMode]);
