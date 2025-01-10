/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ID: string;
  // 其他环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
