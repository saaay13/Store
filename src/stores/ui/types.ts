// Toast Types
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number; // milliseconds
}

export interface ToastOptions {
  variant?: ToastVariant;
  duration?: number; // default: 5000ms
}

// Confirmation Dialog Types
export type ConfirmVariant = 'danger' | 'warning' | 'info';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string; // default: "Confirmar"
  cancelText?: string; // default: "Cancelar"
  variant?: ConfirmVariant; // default: "info"
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface ConfirmState {
  isOpen: boolean;
  isLoading: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant: ConfirmVariant;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

// Context Value
export interface UIServiceContextValue {
  // Toast methods
  toast: {
    show: (message: string, options?: ToastOptions) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
  };

  // Confirm methods
  confirm: {
    show: (options: ConfirmOptions) => void;
    delete: (itemName: string, onConfirm: () => void | Promise<void>) => void;
    restore: (itemName: string, onConfirm: () => void | Promise<void>) => void;
  };
}
