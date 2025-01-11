import * as services from "./services";

type ServiceMethods<T> = {
  [K in keyof T]: T[K] extends { prototype: infer P }
    ? {
        [M in Exclude<keyof P, "constructor">]: `${string & K}:${string & M}`;
      }[Exclude<keyof P, "constructor">]
    : never;
}[keyof T];

type MethodParams<T, M extends string> = T extends { prototype: infer P }
  ? P[M & keyof P] extends (...args: infer Args) => any
    ? Args
    : never
  : never;

type MethodReturn<T, M extends string> = T extends { prototype: infer P }
  ? P[M & keyof P] extends (...args: any[]) => infer R
    ? R
    : never
  : never;

type IpcChannel = ServiceMethods<typeof services>;

declare global {
  interface Window {
    electron: {
      invoke<C extends IpcChannel>(
        channel: C,
        ...args: MethodParams<
          (typeof services)[C extends `${infer S}:${any}` ? S : never],
          C extends `${any}:${infer M}` ? M : never
        >
      ): Promise<
        MethodReturn<
          (typeof services)[C extends `${infer S}:${any}` ? S : never],
          C extends `${any}:${infer M}` ? M : never
        >
      >;
    };
  }
}
