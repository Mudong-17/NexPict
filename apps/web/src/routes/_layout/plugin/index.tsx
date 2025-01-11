import { createFileRoute } from "@tanstack/react-router";

import {
  Body1,
  Button,
  Caption1,
  Caption2,
  Card,
  CardFooter,
  CardHeader,
  Input,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from "@fluentui/react-components";
import { MoreHorizontal20Regular } from "@fluentui/react-icons";
import { usePluginStore } from "@/store";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

const Plugin = () => {
  const navigate = useNavigate({ from: "/plugin" });

  const plugins = usePluginStore((state) => state.plugins);
  const fetchPlugins = usePluginStore((state) => state.fetchPlugins);

  const [downloadUrl, setDownloadUrl] = useState<string>("");

  const deletePlugin = async (id: string) => {
    await window.electron.invoke("PluginServices:deletePlugin", {
      pluginId: id,
    });
    fetchPlugins(true);
  };

  return (
    <div className="h-full flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <Input
          className="w-full"
          placeholder="请输入插件下载地址"
          value={downloadUrl}
          onChange={(_, data) => {
            setDownloadUrl(data.value as string);
          }}
        />
        <Button
          appearance="primary"
          onClick={async () => {
            const result: any = await window.electron.invoke(
              "PluginServices:download",
              {
                url: downloadUrl,
              }
            );
            if (result.code === 200) {
              fetchPlugins();
            }
          }}
        >
          下载插件
        </Button>
      </div>
      {plugins.length === 0 ? (
        <div className="h-full flex items-center justify-center flex-col gap-4 text-gray-400">
          <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z" />
          </svg>
          <p className="text-lg">暂无插件</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {plugins.map((item) => {
            return (
              <Card
                key={item.id}
                onClick={() => {
                  navigate({
                    to: `/plugin/$id`,
                    params: { id: item.id },
                  });
                }}
              >
                <CardHeader
                  header={
                    <div className="flex gap-2">
                      <Body1>{item.metadata.name}</Body1>
                      <Caption2>{item.metadata.version}</Caption2>
                    </div>
                  }
                  description={
                    <div className="flex flex-col gap-2">
                      <Caption1>作者: {item.metadata.author}</Caption1>
                      <Caption1>
                        <span className="line-clamp-2">
                          {item.metadata.description}
                        </span>
                      </Caption1>
                    </div>
                  }
                />
                <CardFooter
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  action={
                    <Menu positioning={{ autoSize: true }}>
                      <MenuTrigger disableButtonEnhancement>
                        <Button
                          appearance="transparent"
                          icon={<MoreHorizontal20Regular />}
                        />
                      </MenuTrigger>

                      <MenuPopover>
                        <MenuList>
                          <MenuItem
                            onClick={() => {
                              deletePlugin(item.id);
                            }}
                          >
                            删除
                          </MenuItem>
                        </MenuList>
                      </MenuPopover>
                    </Menu>
                  }
                ></CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute("/_layout/plugin/")({
  component: Plugin,
});
