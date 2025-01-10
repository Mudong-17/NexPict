import { is } from '@electron-toolkit/utils';
import { app } from 'electron';
import Store from 'electron-store';
import { DEV_USER_DATA } from '../share';

export const store = new Store({
  name: 'nexpict',
  cwd: is.dev ? DEV_USER_DATA : app.getPath('userData'),
  // encryptionKey: is.dev ? undefined : SALT,
});

export const storage = new Store({
  name: 'storage',
  cwd: is.dev ? DEV_USER_DATA : app.getPath('userData'),
  // encryptionKey: is.dev ? undefined : SALT,
});

export const pluginStore = new Store({
  name: 'plugins',
  cwd: is.dev ? DEV_USER_DATA : app.getPath('userData'),
  // encryptionKey: is.dev ? undefined : SALT,
});

export default store;
