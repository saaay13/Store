import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { ToastContainer } from '../../components/organisms/ToastContainer';
import { ConfirmDialog } from '../../components/organisms/ConfirmDialog';
import type {
  Toast,
  ToastOptions,
  ConfirmOptions,
  ConfirmState,
  UIServiceContextValue,
} from './types';

interface UIServiceContextInternal extends UIServiceContextValue {
  // Internal state for components
  _toasts: Toast[];
  _removeToast: (id: string) => void;
  _confirmState: ConfirmState;
  _handleConfirm: () => Promise<void>;
  _handleCancel: () => void;
}

const UIServiceContext = createContext<UIServiceContextInternal | undefined>(undefined);

let toastIdCounter = 0;
const DEFAULT_TOAST_DURATION = 5000;
const MAX_TOASTS = 5;

export function UIServiceProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    isLoading: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    variant: 'info',
    onConfirm: () => {},
  });

  // ==================== TOAST METHODS ====================

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, options?: ToastOptions) => {
      const id = `toast-${++toastIdCounter}`;
      const duration = options?.duration ?? DEFAULT_TOAST_DURATION;
      const variant = options?.variant ?? 'info';

      const toast: Toast = {
        id,
        message,
        variant,
        duration,
      };

      setToasts((prev) => {
        const newToasts = [...prev, toast];
        if (newToasts.length > MAX_TOASTS) {
          return newToasts.slice(-MAX_TOASTS);
        }
        return newToasts;
      });
    },
    []
  );

  const toastSuccess = useCallback(
    (message: string, duration?: number) => {
      showToast(message, { variant: 'success', duration });
    },
    [showToast]
  );

  const toastError = useCallback(
    (message: string, duration?: number) => {
      showToast(message, { variant: 'error', duration });
    },
    [showToast]
  );

  const toastWarning = useCallback(
    (message: string, duration?: number) => {
      showToast(message, { variant: 'warning', duration });
    },
    [showToast]
  );

  const toastInfo = useCallback(
    (message: string, duration?: number) => {
      showToast(message, { variant: 'info', duration });
    },
    [showToast]
  );

  // ==================== CONFIRM METHODS ====================

  const showConfirm = useCallback((options: ConfirmOptions) => {
    setConfirmState({
      isOpen: true,
      isLoading: false,
      title: options.title,
      message: options.message,
      confirmText: options.confirmText ?? 'Confirmar',
      cancelText: options.cancelText ?? 'Cancelar',
      variant: options.variant ?? 'info',
      onConfirm: options.onConfirm,
      onCancel: options.onCancel,
    });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmState((prev) => ({
      ...prev,
      isOpen: false,
      isLoading: false,
    }));
  }, []);

  const handleConfirm = useCallback(async () => {
    setConfirmState((prev) => ({ ...prev, isLoading: true }));

    try {
      await confirmState.onConfirm();
      closeConfirm();
    } catch (error) {
      // Si hay error, mantener el modal abierto y mostrar toast
      setConfirmState((prev) => ({ ...prev, isLoading: false }));

      // Extraer mensaje específico del backend
      let errorMessage = 'Ocurrió un error al realizar la operación';

      if (error && typeof error === 'object' && 'message' in error) {
        const apiError = error as { message: string; errors?: string[] };

        // Priorizar errores de validación si existen
        if (apiError.errors && Array.isArray(apiError.errors) && apiError.errors.length > 0) {
          errorMessage = apiError.errors.join('. ');
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      }

      toastError(errorMessage);
      console.error('Error in confirmation action:', error);
    }
  }, [confirmState.onConfirm, closeConfirm, toastError]);

  const handleCancel = useCallback(() => {
    if (confirmState.onCancel) {
      confirmState.onCancel();
    }
    closeConfirm();
  }, [confirmState.onCancel, closeConfirm]);

  // Helper methods for common confirmation scenarios
  const confirmDelete = useCallback(
    (itemName: string, onConfirm: () => void | Promise<void>) => {
      showConfirm({
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que deseas eliminar "${itemName}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        variant: 'danger',
        onConfirm,
      });
    },
    [showConfirm]
  );

  const confirmRestore = useCallback(
    (itemName: string, onConfirm: () => void | Promise<void>) => {
      showConfirm({
        title: 'Confirmar Restauración',
        message: `¿Estás seguro de que deseas restaurar "${itemName}"?`,
        confirmText: 'Restaurar',
        cancelText: 'Cancelar',
        variant: 'info',
        onConfirm,
      });
    },
    [showConfirm]
  );

  // ==================== CONTEXT VALUE ====================

  const value: UIServiceContextInternal = {
    toast: {
      show: showToast,
      success: toastSuccess,
      error: toastError,
      warning: toastWarning,
      info: toastInfo,
    },
    confirm: {
      show: showConfirm,
      delete: confirmDelete,
      restore: confirmRestore,
    },
    // Internal state (prefixed with _ to indicate internal use)
    _toasts: toasts,
    _removeToast: removeToast,
    _confirmState: confirmState,
    _handleConfirm: handleConfirm,
    _handleCancel: handleCancel,
  };

  return (
    <UIServiceContext.Provider value={value}>
      {children}
      <ToastContainer />
      <ConfirmDialog />
    </UIServiceContext.Provider>
  );
}

// ==================== HOOKS ====================

export function useUIService(): UIServiceContextValue {
  const context = useContext(UIServiceContext);
  if (!context) {
    throw new Error('useUIService must be used within UIServiceProvider');
  }

  // Return only public API (without internal state)
  return {
    toast: context.toast,
    confirm: context.confirm,
  };
}

// Internal hooks for UI components (not exported in index.ts)
export function _useToastsInternal() {
  const context = useContext(UIServiceContext);
  if (!context) {
    throw new Error('_useToastsInternal must be used within UIServiceProvider');
  }
  return {
    toasts: context._toasts,
    removeToast: context._removeToast,
  };
}

export function _useConfirmInternal() {
  const context = useContext(UIServiceContext);
  if (!context) {
    throw new Error('_useConfirmInternal must be used within UIServiceProvider');
  }
  return {
    state: context._confirmState,
    onConfirm: context._handleConfirm,
    onCancel: context._handleCancel,
  };
}
