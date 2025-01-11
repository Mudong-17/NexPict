import { Toast, ToastBody, Toaster, ToastTitle, useId, useToastController } from '@fluentui/react-components';
import { createContext, ReactNode, useCallback, useContext } from 'react';
import { createPortal } from 'react-dom';

interface Options {
  position?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end';
  intent?: 'success' | 'warning' | 'error' | 'info';
  spinner?: boolean;
  title?: string | ReactNode;
  content?: string | ReactNode;
  onConfirm?: () => Promise<void>;
  onCancel?: () => Promise<void>;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

interface ToastContextType {
  showToast: (options: Options) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const toasterId = useId('toaster');
  const { dispatchToast } = useToastController(toasterId);

  const showToast = useCallback((customOptions: Options) => {
    dispatchToast(
      <Toast>
        <ToastTitle>{customOptions.title}</ToastTitle>
        <ToastBody>{customOptions.content}</ToastBody>
      </Toast>,
      { position: customOptions.position || 'top', intent: customOptions.intent || 'info' },
    );
  }, []);

  const ToastComponent = <Toaster toasterId={toasterId} />;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(ToastComponent, document.body)}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
