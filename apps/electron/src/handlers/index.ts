import { ipcMain } from "electron";
import * as services from "@/services";

// 注册所有服务的 IPC 处理器
export function registerIpcHandlers() {
  Object.entries(services).forEach(([serviceName, ServiceClass]) => {
    const service = new ServiceClass();

    // 获取服务类的所有方法
    const methods = Object.getOwnPropertyNames(ServiceClass.prototype).filter(
      (name) => name !== "constructor"
    );

    methods.forEach((methodName) => {
      const channel = `${serviceName}:${methodName}`;
      ipcMain.handle(channel, async (_, ...args) => {
        return (service[methodName as keyof typeof service] as Function)(
          ...args
        );
      });
    });
  });
}
