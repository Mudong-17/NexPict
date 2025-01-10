import { app, nativeTheme } from 'electron'
import { ipcMethod } from '../decorators/ipcMethod'
import { store } from '../utils'

export class AppServices {
  @ipcMethod
  async getAppInfo() {
    return {
      name: app.getName(),
      version: app.getVersion(),
      darkMode: store.has('darkMode') ? store.get('darkMode') : nativeTheme.shouldUseDarkColors,
      locale: app.getLocale(),
      country: app.getLocaleCountryCode(),
      platform: process.platform
    }
  }

  @ipcMethod
  async setUserConfig({ key, value }: { key: string; value: any }) {
    store.set(key, value)
  }

  @ipcMethod
  async quit() {
    app.quit()
    return
  }
}
