import { createFileRoute } from "@tanstack/react-router";

import {
  Button,
  Field,
  Input,
  Select,
  Switch,
  Textarea,
} from "@fluentui/react-components";
import { useToast } from "@/providers";
import { usePluginStore } from "@/store";
import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const Config = () => {
  const { id } = useParams({ from: "/_layout/plugin/$id" });

  const { showToast } = useToast();

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {},
  });

  const [configSchema, setConfigSchema] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // 添加加载状态

  const pluginConfigSchema = usePluginStore(
    (state) => state.pluginConfigSchema
  );
  const fetchPluginConfig = usePluginStore((state) => state.fetchPluginConfig);

  const initConfig = async (pluginId: string) => {
    setIsLoading(true);
    try {
      const schema = pluginConfigSchema(pluginId);
      const config = await fetchPluginConfig(pluginId);
      setConfigSchema(schema);
      if (config) {
        reset(config);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    initConfig(id);
  }, [id]);

  const saveConfig = async (data) => {
    const result: any = await window.electron.invoke(
      "PluginServices:saveConfig",
      {
        pluginId: id,
        config: data,
      }
    );
    if (result.code === 200) {
      showToast({ title: "配置成功", intent: "success" });
    }
  };

  if (isLoading) {
    return null;
  }

  if (!configSchema || Object.keys(configSchema).length === 0)
    return (
      <div className="h-full flex items-center justify-center flex-col gap-4 text-gray-400">
        <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
        </svg>
        <p className="text-lg">该插件无需配置</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      <form>
        {Object.entries(configSchema).map(([key, schema]: any) => (
          <Controller
            key={key}
            name={key as never}
            control={control}
            rules={{ required: schema.required }}
            render={({ field }) => {
              // 根据schema.type来决定渲染的组件 input | select | boolean | number | textarea
              if (schema.type === "select") {
                return (
                  <Field label={schema.label} required={schema.required}>
                    <Select {...field}>
                      {schema.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                );
              }

              if (schema.type === "boolean") {
                return (
                  <Field
                    label={schema.label}
                    required={schema.required}
                    orientation="horizontal"
                  >
                    <Switch {...field} placeholder={schema.description} />
                  </Field>
                );
              }

              if (schema.type === "number") {
                return (
                  <Field label={schema.label} required={schema.required}>
                    <Input
                      {...field}
                      type="number"
                      placeholder={schema.description}
                    />
                  </Field>
                );
              }

              if (schema.type === "textarea") {
                return (
                  <Field label={schema.label} required={schema.required}>
                    <Textarea {...field} placeholder={schema.description} />
                  </Field>
                );
              }

              return (
                <Field label={schema.label} required={schema.required}>
                  <Input {...field} placeholder={schema.description} />
                </Field>
              );
              // <Field label={schema.label} required={schema.required}>
              //   <Input {...field} />
              // </Field>
            }}
          />
        ))}
      </form>

      <Button appearance="primary" onClick={handleSubmit(saveConfig)}>
        保存配置
      </Button>
    </div>
  );
};

export const Route = createFileRoute("/_layout/plugin/$id")({
  component: Config,
});
