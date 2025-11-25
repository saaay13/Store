import { _useToastsInternal } from '../../../stores/ui/UIServiceContext';
import { ToastItem } from './ToastItem';

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
