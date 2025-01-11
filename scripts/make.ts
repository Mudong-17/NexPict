import { copy } from "fs-extra";
import { join } from "path";
import { ensureDir } from "fs-extra";
import { build, Platform } from "electron-builder";
import minimist from "minimist";

// 解析命令行参数
const argv = minimist(process.argv.slice(2));

// 定义支持的平台
type SupportedPlatform = "mac" | "win" | "linux" | undefined;

async function copyFiles() {
  try {
    console.log("开始复制文件...");
    const webSrcDir = join(__dirname, "../apps/web/dist");
    const electronSrcDir = join(__dirname, "../apps/electron/dist");
    const outDir = join(__dirname, "../out");

    await ensureDir(join(outDir, "web"));
    await ensureDir(join(outDir, "electron"));

    await copy(webSrcDir, join(outDir, "web"));
    await copy(electronSrcDir, join(outDir, "electron"));

    console.log("文件复制完成！");
  } catch (error) {
    console.error("复制文件时发生错误:", error);
    process.exit(1);
  }
}

async function buildElectron(platform: SupportedPlatform) {
  const config: any = {
    config: {
      // 基础配置
      appId: "com.future-element.nexpict",
      productName: "奈图",
      artifactName: "${productName}-${version}-${arch}.${ext}",
      asarUnpack: [],
      files: ["out/**/*"],
      directories: {
        output: "release/${version}",
      },
      asar: true,

      // 根据平台设置不同的配置
      win: {
        icon: "./icons/win/icon.ico",
        target: [
          {
            target: "nsis",
            arch: ["arm64", "x64"],
          },
          {
            target: "appx",
            arch: ["arm64", "x64"],
          },
        ],
      },
      nsis: {
        oneClick: false, // 创建的程序是否一键安装
        perMachine: false, // 是否开启安装时权限限制（此电脑或当前用户）
        allowElevation: true, // 是否允许安装时提升权限
        allowToChangeInstallationDirectory: true, // 是否允许用户选择安装目录
        deleteAppDataOnUninstall: true, // 是否在卸载时删除应用程序数据
        createDesktopShortcut: true, // 是否创建桌面快捷方式
        createStartMenuShortcut: true, // 是否创建开始菜单快捷方式
        shortcutName: "奈图", // 桌面快捷方式名称
        runAfterFinish: false, // 完成后是否运行已安装的应用程序
      },
      mac: {
        category: "public.app-category.utilities",
        icon: "./icons/mac/icon.icns",
        target: [
          {
            target: "dmg",
            arch: ["arm64", "x64"],
          },
          // {
          //   target: "mas",
          //   arch: ["arm64", "x64"],
          // },
        ],
      },
      linux: {
        category: "Utility",
        target: ["AppImage", "deb", "snap", "rpm"],
      },
    },
  };

  // 根据平台设置构建目标
  switch (platform) {
    case "mac":
      return build({
        ...config,
        targets: Platform.MAC.createTarget(),
      });
    case "win":
      return build({
        ...config,
        targets: Platform.WINDOWS.createTarget(),
      });
    case "linux":
      return build({
        ...config,
        targets: Platform.LINUX.createTarget(),
      });
    default:
      // 构建默认平台
      return build(config);
  }
}

async function main() {
  try {
    // 获取平台参数
    const platform = argv.platform as SupportedPlatform;

    // 1. 执行构建
    console.log("开始构建项目...");
    const { execSync } = require("child_process");
    execSync("turbo build", { stdio: "inherit" });

    // 2. 复制文件
    await copyFiles();

    // 3. 运行 electron-builder
    console.log(
      `开始打包 electron 应用${platform ? `（${platform}平台）` : ""}...`
    );
    await buildElectron(platform);

    console.log("所有任务完成！");
  } catch (error) {
    console.error("构建过程出错:", error);
    process.exit(1);
  }
}

main();
