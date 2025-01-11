import { app, BrowserWindow } from "electron";
import { is } from "./is";

export interface Platform {
  isWindows: boolean;
  isMacOS: boolean;
  isLinux: boolean;
}

export const platform: Platform = {
  isWindows: process.platform === "win32",
  isMacOS: process.platform === "darwin",
  isLinux: process.platform === "linux",
};

export const APP = {
  setAppUserModelId: (id: string): void => {
    if (platform.isWindows)
      app.setAppUserModelId(is.dev ? process.execPath : id);
  },

  setAutoLaunch: (autoLaunch: boolean): boolean => {
    if (platform.isLinux) return false;

    const isOpenAtLogin = (): boolean => {
      const settings = app.getLoginItemSettings();
      return settings.openAtLogin;
    };
    if (isOpenAtLogin() !== autoLaunch) {
      app.setLoginItemSettings({
        openAtLogin: autoLaunch,
        path: process.execPath,
      });
      return isOpenAtLogin() === autoLaunch;
    } else {
      return true;
    }
  },
  disableDeveloperTools: (window: BrowserWindow): void => {
    if (!window) return;
    if (is.prod) {
      const { webContents } = window;
      webContents.on("before-input-event", (event, input) => {
        // 禁止刷新
        if (input.code === "KeyR" && (input.control || input.meta))
          event.preventDefault();
        // 禁止F12
        if (input.key === "F12") event.preventDefault();
        // 禁止开发者工具
        if (
          input.code === "KeyI" &&
          input.shift &&
          (input.meta || input.control)
        )
          event.preventDefault();
        // 禁止缩放
        if (input.code === "Minus" && (input.control || input.meta))
          event.preventDefault();
        if (
          input.code === "Equal" &&
          input.shift &&
          (input.control || input.meta)
        )
          event.preventDefault();
      });
    }
  },
};
