import { Field, Image, ProgressBar } from '@fluentui/react-components';
import { CloudTabList, FileUploadArea } from '@renderer/components';
import { useDialog, useToast } from '@renderer/providers';
import { usePluginStore } from '@renderer/store';
import { useEffect, useState } from 'react';

interface FileStatus {
  file: File;
  status: 'success' | 'fail' | 'pending';
}

interface UploadedFilesListProps {
  files: FileStatus[];
}

export const UploadedFilesList: React.FC<UploadedFilesListProps> = ({ files }) => {
  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return '/placeholder.svg?height=24&width=24';
  };

  return (
    <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
      {files.map((fileStatus, index) => (
        <div key={index} className="flex items-center justify-between border rounded-lg p-2">
          <div className="flex items-center space-x-2">
            <Image
              src={getFilePreview(fileStatus.file)}
              alt={fileStatus.file.name}
              className="w-6 h-6 object-cover rounded"
            />
            <div className="text-sm truncate max-w-[200px]">{fileStatus.file.name}</div>
          </div>
          <div
            className={`text-xs ${
              fileStatus.status === 'success'
                ? 'text-green-500'
                : fileStatus.status === 'fail'
                  ? 'text-red-500'
                  : 'text-gray-500'
            }`}
          >
            {fileStatus.status === 'success' ? '上传成功' : fileStatus.status === 'fail' ? '上传失败' : '上传中'}
          </div>
        </div>
      ))}
    </div>
  );
};

const ProgressContent = ({ progress, success, fail, total }) => (
  <Field validationMessage={`上传进度：${progress}/${total}, 成功：${success}, 失败：${fail}`} validationState="none">
    <ProgressBar max={total} value={progress} />
  </Field>
);

export default () => {
  const plugins = usePluginStore((state) => state.plugins);
  const pluginOptions = usePluginStore((state) => state.pluginOptions);

  const { showDialog, updateDialogContent, closeDialog } = useDialog();
  const { showToast } = useToast();

  const [progress, setProgress] = useState(0);
  console.log('🚀 ~ progress:', progress);

  const [uploadedFiles, setUploadedFiles] = useState<FileStatus[]>([]);

  const handleSelected = async (files: FileList) => {
    setProgress(0); // 重置进度
    const initialFileStatuses: FileStatus[] = Array.from(files).map((file) => ({
      file,
      status: 'pending',
    }));
    setUploadedFiles(initialFileStatuses);

    showDialog({
      title: '上传文件',
      content: <ProgressContent progress={0} success={0} fail={0} total={files.length} />,
    });
    let success = 0;
    let fail = 0;
    for (let i = 0; i < files.length; i++) {
      const buffer = await files[i].arrayBuffer();
      const file = {
        name: files[i].name,
        type: files[i].type,
        size: files[i].size,
        lastModified: files[i].lastModified,
        buffer: Array.from(new Uint8Array(buffer)),
      };
      try {
        await window.electron.invoke('PluginServices:uploadFile', {
          pluginId: selected,
          file,
        });
        success++;
        setUploadedFiles((prev) => prev.map((f, index) => (index === i ? { ...f, status: 'success' } : f)));
      } catch (error) {
        fail++;
        setUploadedFiles((prev) => prev.map((f, index) => (index === i ? { ...f, status: 'fail' } : f)));
      }

      setProgress((prev) => {
        const newProgress = prev + 1;
        updateDialogContent(
          <ProgressContent progress={newProgress} success={success} fail={fail} total={files.length} />,
        );
        return newProgress;
      });
      if (i === files.length - 1) {
        closeDialog();
        if (fail === 0) {
          showToast({ title: '所有文件上传成功', intent: 'success' });
        } else {
          showToast({ title: '部分文件上传失败', intent: 'warning' });
        }
      }
    }
  };

  const [selected, setSelected] = useState('');

  useEffect(() => {
    setSelected(pluginOptions()[0]?.value || '');
  }, []);

  if (plugins.length === 0) {
    // 如果插件列表为空，新增缺省插件
    return (
      <div className="h-full flex items-center justify-center flex-col gap-4 text-gray-400">
        <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z" />
        </svg>
        <p className="text-lg">暂无插件</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden">
      <CloudTabList tabs={pluginOptions()} selected={selected} onChange={setSelected} />
      <FileUploadArea onSelected={handleSelected} />
      <UploadedFilesList files={uploadedFiles} />
    </div>
  );
};
