import { memo } from 'react';
import './StatusToast.css';

interface StatusToastProps {
  message: string;
  visible: boolean;
}

export const StatusToast = memo(function StatusToast({ message, visible }: StatusToastProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="status-toast" role="status" aria-live="polite">
      {message}
    </div>
  );
});
