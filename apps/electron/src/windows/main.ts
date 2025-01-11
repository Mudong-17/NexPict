import electron from "electron";
import { platform } from "process";
import { join } from "path";
import icon from "@/assets/icon.png";
import { is } from "@nexpict/electron-utils";

export const createMainWindow = () => {
  const mainWindow = new electron.BrowserWindow({
    width: 720,
    height: 536,
    minWidth: 720,
    minHeight: 536,
    show: false,
    frame: false,
    titleBarStyle: "hidden",
    autoHideMenuBar: true,
    resizable: false,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      webSecurity: false,
      preload: join(__dirname, "preload.js"),
      sandbox: false,
    },
  });

  if (platform === "darwin") {
    mainWindow.setWindowButtonVisibility(false);
  }

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  if (is.dev) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.loadFile(join(__dirname, "../web/index.html"));
  }
};
