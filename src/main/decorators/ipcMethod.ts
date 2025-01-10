import { Event, ipcMain } from 'electron';

interface ClassMethodDecorator {
  (target: any, propertyKey: string, descriptor: PropertyDescriptor): void;
  <T extends object>(target: (this: T, ...args: any[]) => any, context: ClassMethodDecoratorContext<T>): void;
}

export const ipcMethod: ClassMethodDecorator = function (
  target: any,
  propertyKeyOrContext: string | ClassMethodDecoratorContext,
  descriptor?: PropertyDescriptor,
): any {
  // 新装饰器语法
  if (typeof propertyKeyOrContext === 'object') {
    const context = propertyKeyOrContext as ClassMethodDecoratorContext;
    const methodName = String(context.name);

    return function (this: any, ...args: any[]) {
      if (process.type === 'browser') {
        const className = this.constructor.name;
        const channel = `${className}:${methodName}`;

        if (!ipcMain.listenerCount(channel)) {
          ipcMain.handle(channel, async (_: Event, ...ipcArgs: any[]) => {
            try {
              return await target.apply(this, ipcArgs);
            } catch (error) {
              throw error;
            }
          });
        }
      }
      return target.apply(this, args);
    };
  }

  // 旧装饰器语法
  if (process.type !== 'browser') return;

  const propertyKey = propertyKeyOrContext as string;
  const className = target.constructor.name;
  const channel = `${className}:${propertyKey}`;
  const originalMethod = descriptor!.value;

  ipcMain.handle(channel, async (_: Event, ...args: any[]) => {
    try {
      return await originalMethod.apply(target, args);
    } catch (error) {
      throw error;
    }
  });

  return descriptor;
};
