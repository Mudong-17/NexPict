import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
} from '@fluentui/react-components';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

interface Options {
  title?: string | ReactNode;
  content?: string | ReactNode;
  onConfirm?: () => Promise<void>;
  onCancel?: () => Promise<void>;
  onClose?: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

interface DialogContextType {
  showDialog: (options: Options) => void;
  updateDialogContent: (content: ReactNode) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

const defaultOptions: Options = {
  title: '确认操作',
  content: '',
  confirmButtonText: '确 定',
  cancelButtonText: '取 消',
  onConfirm: async () => {},
  onCancel: async () => {},
  onClose: () => {},
};

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Options>(defaultOptions);
  const [dialogContent, setDialogContent] = useState<ReactNode | null>(null);

  const showDialog = useCallback((customOptions: Options) => {
    setOptions({ ...options, ...customOptions });
    setDialogContent(customOptions.content);
    setOpen(true);
  }, []);

  const updateDialogContent = useCallback((newContent: ReactNode) => {
    setDialogContent(newContent);
  }, []);

  const closeDialog = () => {
    setOpen(false);
    options.onClose && options.onClose();
    setTimeout(() => {
      setOptions(defaultOptions);
    }, 200);
  };

  const handleClose = useCallback(async () => {
    options.onCancel && (await options.onCancel());
    closeDialog();
  }, [options, closeDialog]);

  const handleConfirm = useCallback(async () => {
    options.onConfirm && (await options.onConfirm());
    closeDialog();
  }, [options, closeDialog]);

  const DialogComponent = (
    <Dialog open={open}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{options.title}</DialogTitle>
          <DialogContent>{dialogContent}</DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary" onClick={handleClose}>
                {options.cancelButtonText}
              </Button>
            </DialogTrigger>
            <Button appearance="primary" onClick={handleConfirm}>
              {options.confirmButtonText}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );

  return (
    <DialogContext.Provider value={{ showDialog, updateDialogContent, closeDialog }}>
      {children}
      {createPortal(DialogComponent, document.body)}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
