import type React from 'react';
import Dialog from '../../molecules/Dialog';
import Button from '../../atoms/Button';
import { _useConfirmInternal } from '../../../stores/ui/UIServiceContext';
import type { ConfirmVariant } from '../../../stores/ui/types';

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
    iconColor: 'text-error',
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
    iconColor: 'text-warning',
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
    iconColor: 'text-info',
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
        <p className="text-muted-foreground text-sm">{state.message}</p>
      </div>
    </Dialog>
  );
}
