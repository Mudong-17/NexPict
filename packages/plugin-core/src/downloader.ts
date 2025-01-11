import fs from "fs-extra";
import path from "path";
import { nanoid } from "nanoid";

// 插件下载器
export class PluginDownloader {
  // private readonly logger = createLogger('plugin-downloader');

  async download(url: string, targetDir: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    const pluginPath = path.join(targetDir, `${nanoid()}.mjs`);
    await fs.writeFile(pluginPath, await response.text());
    return pluginPath;
  }
}
