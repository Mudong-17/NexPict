<div align="center">
  <img src="./resources/icon.png" width="100" alt="">
  <h1>奈图 NexPict</h1>
</div>

## NexPict 奈图

📷奈图 —— 超给力的图床上传工具！界面简洁易上手，几步就能将图片飞速上传至云端。更绝的是，它支持自由开发上传插件😎。不管你有啥个性化需求，想对接特殊平台，还是适配独特场景，奈图都放权给你，任你定制专属方案，管理图片超随心。

## 特色功能

- 支持自由开发上传插件
- 支持自定义图床

## 插件开发

> esm 模块，目前整体标准不完善，后续会持续更新，让插件开发更简单。

```typescript
import { Buffer } from "buffer";
import type { UploaderPlugin, Input } from "@nexpict/plugin-core";

interface SmmsResponse {
  file_id: number;
  width: number;
  height: number;
  filename: string;
  storename: string;
  size: number;
  path: string;
  hash: string;
  url: string;
  delete: string;
  page: string;
}

const SmmsPlugin: UploaderPlugin<Input, SmmsResponse> = {
  metadata: {
    name: "SM.MS", // 插件名称
    version: "0.2.0", // 插件版本
    description: "上传资源到 SM.MS", // 插件描述
    author: "暮冬拾柒", // 插件作者
    type: "uploader", // 插件类型
  },

  configSchema: {
    // 插件配置
    token: {
      type: "input", // 配置类型 input | select | boolean | textarea | number
      label: "API Token", // 配置名称
      description: "SM.MS API Token", // 配置描述
      required: true, // 是否必填
    },
  },

  // 配置插件方法，必须实现
  async configure(config: Record<string, any>): Promise<void> {
    this.config = config;
  },

  // 验证配置方法，必须实现
  async validateConfig(config: Record<string, any>): Promise<boolean> {
    return Boolean(config.token && typeof config.token === "string");
  },

  // 生命周期 处理输入前
  async beforePipe(ctx): Promise<void> {},

  // 生命周期 处理输入 不同插件处理方式不同
  async pipe(ctx): Promise<void> {
    const buffer = Buffer.from(ctx.input.buffer as ArrayBuffer);

    const blob = new Blob([buffer], { type: ctx.input.type });

    ctx.input = new File([blob], ctx.input.name, {
      type: ctx.input.type,
      lastModified: ctx.input.lastModified,
    });
  },
  // 生命周期 上传前
  async beforeUpload(ctx): Promise<void> {},

  // 生命周期 上传 必须实现 且输出 ctx.output output 需url字段 才能在图册中展示
  async upload(ctx): Promise<void> {
    const formData = new FormData();
    formData.append("smfile", ctx.input as File);

    const response = await fetch("https://sm.ms/api/v2/upload", {
      method: "POST",
      headers: {
        Authorization: this.config.token,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || result.code !== "success") {
      throw new Error(result.message || "Upload failed");
    }

    ctx.output = {
      filename: ctx.input.name,
      ...result.data,
    };
  },

  // 生命周期 上传后
  async afterUpload(ctx): Promise<void> {},

  // 生命周期 删除资源
  async deleteResource(resourace) {
    await fetch(resourace.delete, {
      method: "GET",
    });
  },
};
// 导出插件
export default SmmsPlugin;
```

## 已收录插件

> 插件安装方法，在图床中心页面，将插件链接复制到输入框中，点击下载插件即可。

- SM.MS:
  - https://cdn.jsdelivr.net/npm/@nexpict/smms/dist/index.mjs
  - https://unpkg.com/@nexpict/smms@0.2.0/dist/index.mjs
- 阿里云OSS:
  - https://cdn.jsdelivr.net/npm/@nexpict/oss/dist/index.mjs
  - https://unpkg.com/@nexpict/oss@0.2.0/dist/index.mjs

## 赞助

如果你喜欢 奈图 并且它对你确实有帮助，欢迎给我打赏一杯咖啡哈~

支付宝：

![alipay](./README/alipay.png)

微信：

![wechat](./README/wechat.png)
