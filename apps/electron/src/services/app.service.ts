import { app } from "electron";

export class AppService {
  getAppInfo() {
    return {
      name: app.getName(),
      version: app.getVersion(),
      // darkMode: store.has('darkMode') ? store.get('darkMode') : nativeTheme.shouldUseDarkColors,
      locale: app.getLocale(),
      country: app.getLocaleCountryCode(),
      platform: process.platform,
    };
  }

  setUserConfig({ key, value }: { key: string; value: any }) {
    // store.set(key, value)
  }

  quit() {
    app.quit();
  }
}
