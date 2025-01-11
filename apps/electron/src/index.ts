import { app, BrowserWindow } from "electron";
import { createMainWindow } from "@/windows";
import { APP } from "@nexpict/electron-utils";
import { registerIpcHandlers } from "@/handlers";

app.whenReady().then(() => {
  APP.setAppUserModelId("com.future-element.nexpict");

  app.on("browser-window-created", (_, window) => {
    APP.disableDeveloperTools(window);
  });

  registerIpcHandlers();

  createMainWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
