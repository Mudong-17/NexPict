import { Button } from '@fluentui/react-components';
import { Delete24Regular } from '@fluentui/react-icons';
import { CloudTabList } from '@renderer/components';
import { usePluginStore } from '@renderer/store';
import { useEffect, useState } from 'react';

export default () => {
  const pluginOptions = usePluginStore((state) => state.pluginOptions);
  const fetchPluginResources = usePluginStore((state) => state.fetchPluginResources);

  const [selected, setSelected] = useState('');
  const [dataSource, setDataSource] = useState<any[]>([]);

  const fetchResources = async (id: string) => {
    const resources = await fetchPluginResources(id);
    setDataSource(resources);
  };

  useEffect(() => {
    setSelected(pluginOptions()[0]?.value || '');
  }, []);

  useEffect(() => {
    if (selected) {
      fetchResources(selected);
    }
  }, [selected]);

  const handleDelete = async (item: any) => {
    // 实现删除逻辑
    await window.electron.invoke('PluginServices:deleteResource', {
      pluginId: selected,
      resource: item,
    });
    // 从dataSource中移除该项
    setDataSource(dataSource.filter((i) => i.url !== item.url));
  };

  return (
    <div className="flex flex-col gap-4 overflow-hidden h-full">
      <CloudTabList tabs={pluginOptions()} selected={selected} onChange={setSelected} />
      {dataSource.length === 0 ? (
        <div className="h-full flex items-center justify-center flex-col gap-4 text-gray-400">
          <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-4.86-7.14l-3 3.86L9 13.14 6 17h12l-3.86-5.14z" />
          </svg>
          <p className="text-lg">暂无图片</p>
        </div>
      ) : (
        <div className="overflow-y-auto flex-1">
          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {dataSource.map((item) => (
              <div
                key={item.url}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                style={{ aspectRatio: '1/1' }}
              >
                <div className="w-full h-full">
                  <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-2">
                  <p className="text-white font-semibold truncate max-w-[calc(100%-40px)]">{item.filename}</p>
                  <div className="flex-shrink-0">
                    <Button
                      icon={<Delete24Regular className="text-white group-hover:text-red-500" />}
                      appearance="transparent"
                      className="p-1 min-w-0 h-auto"
                      onClick={() => handleDelete(item)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
