import { is } from '@electron-toolkit/utils';
import electron from 'electron';
import { join } from 'path';
import { platform } from 'process';
import { fileURLToPath } from 'url';

const icon = join(__dirname, '../resources/icon.png');

export const createMainWindow = () => {
  const mainWindow = new electron.BrowserWindow({
    width: 720,
    height: 536,
    minWidth: 720,
    minHeight: 536,
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    resizable: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      webSecurity: false,
      preload: fileURLToPath(new URL('../preload/index.mjs', import.meta.url)),
      sandbox: false,
    },
  });

  if (platform === 'darwin') {
    mainWindow.setWindowButtonVisibility(false);
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
};
