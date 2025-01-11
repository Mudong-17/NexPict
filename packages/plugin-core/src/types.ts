export interface ConfigSchemaField {
  type: "input" | "number" | "boolean" | "select" | "textarea";
  options?: { label: string; value: any }[];
  label: string;
  description: string;
  required?: boolean;
  default?: any;
  min?: number;
  max?: number;
  visibleIf?: Record<string, any>;
}

// 类型定义
export interface Plugin {
  metadata: {
    name: string;
    version: string;
    description: string;
    author: string;
  };
  configSchema: {
    [key: string]: ConfigSchemaField;
  };
  configure: (config: any) => void;
  beforePipe?: (ctx: PluginContext) => Promise<void>;
  pipe?: (ctx: PluginContext) => Promise<void>;
  beforeUpload?: (ctx: PluginContext) => Promise<void>;
  upload: (ctx: PluginContext) => Promise<void>;
  afterUpload?: (ctx: PluginContext) => Promise<void>;
  deleteResource: (resource: any) => Promise<void>;
}

export interface PluginContext {
  input: any;
  output: any;
}
