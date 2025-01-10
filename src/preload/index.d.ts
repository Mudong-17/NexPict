import * as services from '../main/services'

type ServiceMethods<T> = {
  [K in keyof T]: T[K] extends { prototype: infer P }
    ? {
        [M in Exclude<keyof P, 'constructor'>]: `${string & K}:${string & M}`
      }[Exclude<keyof P, 'constructor'>]
    : never
}[keyof T]

type IpcChannel = ServiceMethods<typeof services>

declare global {
  interface Window {
    electron: {
      invoke<T>(channel: IpcChannel, ...args: any[]): Promise<T>
    }
  }
}
