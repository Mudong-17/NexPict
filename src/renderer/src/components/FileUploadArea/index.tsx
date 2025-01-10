'use client';

import { Link, makeStyles, tokens, useThemeClassName } from '@fluentui/react-components';
import { CloudArrowUp24Regular } from '@fluentui/react-icons';
import React, { DragEvent, useRef, useState } from 'react';

const useStyles = makeStyles({
  root: {
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
    '&:hover': {
      boxShadow: tokens.shadow4, // 添加阴影效果
    },
  },
  dragActive: {
    backgroundColor: tokens.colorNeutralBackground1,
    '&:hover': {
      boxShadow: tokens.shadow4, // 添加阴影效果
      transform: 'translateY(-2px)', // 轻微上移效果
    },
  },
  icon: {
    color: tokens.colorNeutralForeground2,
  },
  text: {
    color: tokens.colorNeutralForeground2,
  },
  link: {
    color: tokens.colorBrandForeground1,
    '&:hover': {
      color: tokens.colorBrandForeground2,
    },
  },
});

interface FileUploadAreaProps {
  onSelected: (files: FileList) => void;
}

export const FileUploadArea = ({ onSelected }: FileUploadAreaProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const themeClassName = useThemeClassName();
  const styles = useStyles();

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    onSelected(files);
  };

  const onLinkClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`${themeClassName} min-h-[200px] border-2 border-dashed rounded-lg transition-all  duration-300 flex flex-col items-center justify-center cursor-pointer ${
        isDragActive ? styles.dragActive : styles.root
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={onLinkClick}
    >
      <input ref={fileInputRef} type="file" multiple onChange={handleChange} className="hidden" />
      <div className="flex flex-col items-center justify-center space-y-4 p-6">
        <CloudArrowUp24Regular className={`w-8 h-8 ${styles.icon}`} />
        <div className={styles.text}>
          将文件拖到此处，或
          <Link as="button" className={styles.link}>
            点击上传
          </Link>
        </div>
      </div>
    </div>
  );
};
