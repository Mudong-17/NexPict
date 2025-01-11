import { ipcRenderer, contextBridge } from "electron";

const electronAPI = {
  invoke<T>(...args: Parameters<typeof ipcRenderer.invoke>): Promise<T> {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
}
