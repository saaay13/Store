# UI Service Implementation Guide

## Guía de Implementación del Sistema de Toasts y Modales de Confirmación

Este documento explica cómo implementar el sistema de UIService en un nuevo proyecto React + TypeScript. El sistema proporciona toasts (notificaciones) y diálogos de confirmación de manera centralizada.

**🎨 Nota sobre colores:** Este sistema usa las variables semánticas del proyecto. Ver **[COLOR-SYSTEM-GUIDE.md](./COLOR-SYSTEM-GUIDE.md)** para la paleta completa y soporte de dark mode.

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Paso 1: Tipos TypeScript](#paso-1-tipos-typescript)
4. [Paso 2: Context y Provider](#paso-2-context-y-provider)
5. [Paso 3: Componente ToastItem](#paso-3-componente-toastitem)
6. [Paso 4: Componente ToastContainer](#paso-4-componente-toastcontainer)
7. [Paso 5: Componente ConfirmDialog](#paso-5-componente-confirmdialog)
8. [Paso 6: Configuración en la App](#paso-6-configuración-en-la-app)
9. [Uso del Sistema](#uso-del-sistema)
10. [Ejemplos Prácticos](#ejemplos-prácticos)
11. [Dependencias y Notas](#dependencias-y-notas)

---

## Descripción General

El sistema UIService proporciona:

### **Toasts (Notificaciones)**
- 4 variantes: `success`, `error`, `warning`, `info`
- Auto-dismiss configurable (default: 5 segundos)
- Cierre manual por el usuario
- Límite máximo de 5 toasts simultáneos
- Animaciones de entrada/salida
- Posicionado fijo (top-right)
- **Colores:** Usa variables semánticas (`bg-success`, `bg-error`, `bg-warning`, `bg-info`) con soporte para dark mode

### **Diálogos de Confirmación**
- 3 variantes: `danger`, `warning`, `info`
- Soporte para acciones asíncronas
- Estados de loading
- Helpers preconstruidos: `confirmDelete()`, `confirmRestore()`
- Manejo automático de errores con toasts
- **Colores:** Usa variables semánticas con adaptación automática a dark mode

---

## Estructura de Archivos

```
src/
├── stores/
│   └── ui/
│       ├── types.ts                    # Tipos TypeScript
│       ├── UIServiceContext.tsx        # Context y Provider
│       └── index.ts                    # Barrel export
│
└── components/
    └── organisms/
        ├── ToastContainer/
        │   ├── ToastContainer.tsx      # Contenedor de toasts
        │   ├── ToastItem.tsx           # Toast individual
        │   └── index.ts
        │
        └── ConfirmDialog/
            ├── ConfirmDialog.tsx       # Diálogo de confirmación
            └── index.ts
```

---

## Paso 1: Tipos TypeScript

**Archivo:** `src/stores/ui/types.ts`

```typescript
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
```

---

## Paso 2: Context y Provider

**Archivo:** `src/stores/ui/UIServiceContext.tsx`

```typescript
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { ToastContainer } from '@/components/organisms/ToastContainer';
import { ConfirmDialog } from '@/components/organisms/ConfirmDialog';
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
    [removeToast]
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
```

**Archivo:** `src/stores/ui/index.ts`

```typescript
export { UIServiceProvider, useUIService } from './UIServiceContext';
export type {
  Toast,
  ToastOptions,
  ToastVariant,
  ConfirmOptions,
  ConfirmVariant,
  UIServiceContextValue,
} from './types';
```

---

## Paso 3: Componente ToastItem

**Archivo:** `src/components/organisms/ToastContainer/ToastItem.tsx`

```typescript
import { useEffect, useState, type ReactElement } from "react";
import type { Toast, ToastVariant } from "@/stores/ui/types";

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const variantStyles: Record<
  ToastVariant,
  { bg: string; border: string; icon: string; text: string; shadow: string }
> = {
  success: {
    bg: "bg-green-500/10 dark:bg-green-400/15",
    border: "!border-green-500/20 dark:!border-green-400/25",
    icon: "text-green-600 dark:text-green-400",
    text: "text-green-900 dark:text-green-100",
    shadow: "shadow-xl shadow-green-500/10 dark:shadow-green-400/20",
  },
  error: {
    bg: "bg-red-500/10 dark:bg-red-400/15",
    border: "!border-red-500/20 dark:!border-red-400/25",
    icon: "text-red-600 dark:text-red-400",
    text: "text-red-900 dark:text-red-100",
    shadow: "shadow-xl shadow-red-500/10 dark:shadow-red-400/20",
  },
  warning: {
    bg: "bg-amber-500/10 dark:bg-amber-400/15",
    border: "!border-amber-500/20 dark:!border-amber-400/25",
    icon: "text-amber-600 dark:text-amber-400",
    text: "text-amber-900 dark:text-amber-100",
    shadow: "shadow-xl shadow-amber-500/10 dark:shadow-amber-400/20",
  },
  info: {
    bg: "bg-blue-500/10 dark:bg-blue-400/15",
    border: "!border-blue-500/20 dark:!border-blue-400/25",
    icon: "text-blue-600 dark:text-blue-400",
    text: "text-blue-900 dark:text-blue-100",
    shadow: "shadow-xl shadow-blue-500/10 dark:shadow-blue-400/20",
  },
};

const icons: Record<ToastVariant, ReactElement> = {
  success: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  info: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

export function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isManualClose, setIsManualClose] = useState(false);
  const styles = variantStyles[toast.variant];

  useEffect(() => {
    if (isManualClose) return;

    if (toast.duration && toast.duration > 0) {
      // Start exit animation 300ms before removal
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, toast.duration - 300);

      // Remove toast after animation completes
      const removeTimer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [toast.duration, toast.id, onRemove, isManualClose]);

  const handleClose = () => {
    setIsManualClose(true);
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  return (
    <div
      className={`
        rounded-2xl transition-all duration-300 ease-out mb-3
        ${isExiting ? "max-h-0 mb-0 opacity-0" : "max-h-[200px] opacity-100"}
      `}
    >
      <div
        className={`
          ${styles.bg} ${styles.border} ${styles.shadow}
          border rounded-2xl p-4 flex items-start gap-3
          transition-all duration-300 ease-out min-w-[320px] max-w-md
          pointer-events-auto backdrop-blur-xl
          ${
            isExiting
              ? "translate-x-full opacity-0"
              : "translate-x-0 opacity-100"
          }
        `}
        role="alert"
        aria-live="polite"
      >
        <div className={`flex-shrink-0 ${styles.icon}`}>
          {icons[toast.variant]}
        </div>

        <div className={`flex-1 text-sm ${styles.text} font-medium`}>
          {toast.message}
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors hover:scale-110"
          aria-label="Cerrar notificación"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
```

---

## Paso 4: Componente ToastContainer

**Archivo:** `src/components/organisms/ToastContainer/ToastContainer.tsx`

```typescript
import { _useToastsInternal } from "@/stores/ui/UIServiceContext";
import { ToastItem } from "./ToastItem";

export function ToastContainer() {
  const { toasts, removeToast } = _useToastsInternal();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}
```

**Archivo:** `src/components/organisms/ToastContainer/index.ts`

```typescript
export { ToastContainer } from './ToastContainer';
```

---

## Paso 5: Componente ConfirmDialog

**Archivo:** `src/components/organisms/ConfirmDialog/ConfirmDialog.tsx`

```typescript
import type React from 'react';
import { Dialog } from '@/components/molecules/Dialog'; // Tu componente Dialog
import { Button } from '@/components/atoms/Button'; // Tu componente Button
import { _useConfirmInternal } from '@/stores/ui/UIServiceContext';
import type { ConfirmVariant } from '@/stores/ui/types';

const variantConfig: Record<
  ConfirmVariant,
  {
    buttonVariant: 'primary' | 'danger';
    iconColor: string;
    icon: React.ReactElement;
  }
> = {
  danger: {
    buttonVariant: 'danger',
    iconColor: 'text-red-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  },
  warning: {
    buttonVariant: 'primary',
    iconColor: 'text-yellow-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  },
  info: {
    buttonVariant: 'primary',
    iconColor: 'text-blue-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
};

export function ConfirmDialog() {
  const { state, onConfirm, onCancel } = _useConfirmInternal();

  if (!state.isOpen) {
    return null;
  }

  const config = variantConfig[state.variant];

  return (
    <Dialog
      isOpen={state.isOpen}
      onClose={state.isLoading ? () => {} : onCancel}
      title={state.title}
      size="sm"
      closeOnOverlay={!state.isLoading}
      showCloseButton={!state.isLoading}
      footer={
        <>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={state.isLoading}
          >
            {state.cancelText}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={onConfirm}
            isLoading={state.isLoading}
            disabled={state.isLoading}
          >
            {state.confirmText}
          </Button>
        </>
      }
    >
      <div className="flex gap-4">
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          {config.icon}
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm">{state.message}</p>
      </div>
    </Dialog>
  );
}
```

**Archivo:** `src/components/organisms/ConfirmDialog/index.ts`

```typescript
export { ConfirmDialog } from './ConfirmDialog';
```

---

## Paso 6: Configuración en la App

**Archivo:** `src/App.tsx` (o donde configures tu app)

```typescript
import { UIServiceProvider } from '@/stores/ui';

function App() {
  return (
    <UIServiceProvider>
      {/* Resto de tu aplicación */}
      <YourAppContent />
    </UIServiceProvider>
  );
}

export default App;
```

---

## Uso del Sistema

### Hook Principal

```typescript
import { useUIService } from '@/stores/ui';

function MyComponent() {
  const { toast, confirm } = useUIService();

  // Usar toast o confirm según necesites
}
```

### API del Toast

```typescript
const { toast } = useUIService();

// Variante específica (recomendado)
toast.success('Operación exitosa');
toast.error('Ocurrió un error');
toast.warning('Advertencia importante');
toast.info('Información relevante');

// Variante genérica con opciones
toast.show('Mensaje personalizado', {
  variant: 'success',
  duration: 3000 // 3 segundos
});

// Con duración personalizada
toast.success('Guardado exitoso', 8000); // 8 segundos
```

### API del Confirm

```typescript
const { confirm } = useUIService();

// Helper para eliminación
confirm.delete('Usuario Juan', async () => {
  await deleteUser(userId);
});

// Helper para restauración
confirm.restore('Usuario Juan', async () => {
  await restoreUser(userId);
});

// Confirmación personalizada
confirm.show({
  title: 'Confirmar Acción',
  message: '¿Deseas continuar con esta operación?',
  confirmText: 'Sí, continuar',
  cancelText: 'No, cancelar',
  variant: 'warning',
  onConfirm: async () => {
    await performAction();
  },
  onCancel: () => {
    console.log('Operación cancelada');
  }
});
```

---

## Ejemplos Prácticos

### Ejemplo 1: Toast en Mutación (React Query)

```typescript
import { useMutation } from '@tanstack/react-query';
import { useUIService } from '@/stores/ui';
import { profileService } from '@/services/profile';

export const useUpdateProfile = () => {
  const { toast } = useUIService();

  return useMutation({
    mutationFn: (data) => profileService.updateProfile(data),
    onSuccess: () => {
      toast.success('Perfil actualizado correctamente');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Error al actualizar el perfil');
    },
  });
};
```

### Ejemplo 2: Confirmación de Eliminación

```typescript
import { useUIService } from '@/stores/ui';
import { useDeleteCategory } from '@/features/categories';

export function CategoryList() {
  const { confirm } = useUIService();
  const deleteMutation = useDeleteCategory();

  const handleDelete = (category) => {
    confirm.delete(category.name, async () => {
      await deleteMutation.mutateAsync(category.id);
    });
  };

  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <span>{category.name}</span>
          <button onClick={() => handleDelete(category)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Ejemplo 3: Confirmación con Lógica Personalizada

```typescript
import { useUIService } from '@/stores/ui';

export function DangerousActionButton() {
  const { confirm, toast } = useUIService();

  const handleDangerousAction = () => {
    confirm.show({
      title: 'Acción Irreversible',
      message: 'Esta acción eliminará todos los datos permanentemente. ¿Estás completamente seguro?',
      confirmText: 'Sí, eliminar todo',
      cancelText: 'No, mantener',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await performDangerousAction();
          toast.success('Datos eliminados correctamente');
        } catch (error) {
          // El error se maneja automáticamente por el sistema
          // y se muestra un toast de error
          throw error;
        }
      },
      onCancel: () => {
        toast.info('Operación cancelada');
      }
    });
  };

  return (
    <button onClick={handleDangerousAction}>
      Acción Peligrosa
    </button>
  );
}
```

### Ejemplo 4: Toast con Duración Personalizada

```typescript
import { useUIService } from '@/stores/ui';

export function ImportantNotification() {
  const { toast } = useUIService();

  const showImportantMessage = () => {
    // Mostrar por 10 segundos
    toast.warning('Este mensaje es muy importante', 10000);
  };

  const showQuickMessage = () => {
    // Mostrar por 2 segundos
    toast.info('Mensaje rápido', 2000);
  };

  return (
    <div>
      <button onClick={showImportantMessage}>
        Mensaje Importante
      </button>
      <button onClick={showQuickMessage}>
        Mensaje Rápido
      </button>
    </div>
  );
}
```

---

## Dependencias y Notas

### Dependencias Necesarias

1. **React 18+** con TypeScript
2. **TailwindCSS** para los estilos
3. **Componentes Base** (debes implementarlos o adaptarlos):
   - `Dialog` component (modal base)
   - `Button` component con variantes y estado `isLoading`

### Adaptación de Componentes Base

Si no tienes estos componentes, puedes:

1. **Usar componentes de tu UI library** (Shadcn, Material-UI, etc.)
2. **Adaptar los estilos** a tu sistema de diseño
3. **Crear componentes básicos** desde cero

### Personalización

#### Cambiar Duración Default de Toasts

En `UIServiceContext.tsx`, línea 24:
```typescript
const DEFAULT_TOAST_DURATION = 5000; // Cambiar a tu valor preferido
```

#### Cambiar Límite de Toasts

En `UIServiceContext.tsx`, línea 25:
```typescript
const MAX_TOASTS = 5; // Cambiar a tu valor preferido
```

#### Cambiar Posición de Toasts

En `ToastContainer.tsx`, línea 14:
```typescript
// Actual: top-right
className="fixed top-4 right-4 z-50..."

// Top-left:
className="fixed top-4 left-4 z-50..."

// Bottom-right:
className="fixed bottom-4 right-4 z-50..."

// Bottom-left:
className="fixed bottom-4 left-4 z-50..."

// Center-top:
className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50..."
```

#### Personalizar Estilos de Variantes

Edita los objetos `variantStyles` en:
- `ToastItem.tsx` (líneas 9-41)
- `ConfirmDialog.tsx` (líneas 7-57)

#### Añadir Nuevas Variantes

1. Agregar tipo en `types.ts`
2. Agregar estilos en componentes
3. Agregar helper en `UIServiceContext.tsx` si es necesario

---

## Características Avanzadas

### Manejo Automático de Errores

El sistema maneja errores de forma inteligente:

```typescript
// En confirm, si onConfirm lanza un error:
confirm.delete('Item', async () => {
  await apiCall(); // Si falla, el modal se mantiene abierto
  // y se muestra un toast de error automáticamente
});
```

### Estados de Loading

Los diálogos de confirmación muestran automáticamente estados de carga:

```typescript
confirm.show({
  // ...opciones
  onConfirm: async () => {
    // Durante esta operación, el diálogo muestra loading
    await longRunningOperation();
    // Al completar, el diálogo se cierra automáticamente
  }
});
```

### Accesibilidad

El sistema incluye:
- Atributos ARIA apropiados
- Roles semánticos correctos
- Manejo de teclado (Escape para cerrar)
- Anuncios para lectores de pantalla

---

## Solución de Problemas

### Los toasts no se muestran

1. Verifica que `UIServiceProvider` esté en el nivel correcto del árbol
2. Confirma que TailwindCSS esté configurado correctamente
3. Verifica z-index (debe ser mayor que otros elementos)

### Los diálogos no se cierran

1. Asegúrate de que `Dialog` maneje correctamente `onClose`
2. Verifica que no haya errores en `onConfirm`
3. Revisa que `closeOnOverlay` esté funcionando

### Estilos no se aplican correctamente

1. Confirma que TailwindCSS esté procesando las clases dinámicas
2. Agrega las clases a la safelist de Tailwind si es necesario
3. Verifica la configuración de dark mode

---

## Mejoras Futuras Sugeridas

1. **Persistencia**: Guardar toasts críticos en localStorage
2. **Acciones**: Botones de acción dentro de los toasts
3. **Sonidos**: Notificaciones de audio opcionales
4. **Posiciones**: Configurar posición de toasts globalmente
5. **Animaciones**: Más variantes de animación
6. **Temas**: Sistema de temas personalizable
7. **Queue**: Sistema de cola avanzado para toasts
8. **Analytics**: Tracking de interacciones con toasts/confirms

---

## Recursos Adicionales

- [React Context API Docs](https://react.dev/reference/react/useContext)
- [TailwindCSS Animation](https://tailwindcss.com/docs/animation)
- [ARIA Roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)

---

## Licencia

Este código es parte del proyecto Coling-Frontend y puede ser utilizado libremente en otros proyectos con la debida atribución.
