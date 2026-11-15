import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-2xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 transition-opacity"
        style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(10px)' }}
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div
          className={`relative overflow-hidden rounded-2xl w-full ${maxWidth} shadow-2xl transition-all`}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div className="min-w-0 pr-2">
              <h3 className="text-sm sm:text-base font-bold text-white truncate">{title}</h3>
              {description && (
                <p className="text-[11px] sm:text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl transition-colors hover:bg-white/5 active:scale-95 text-zinc-400 hover:text-white flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body with iOS momentum scrolling */}
          <div
            className="px-4 sm:px-6 py-4 sm:py-5 max-h-[calc(88vh-80px)] sm:max-h-[calc(85vh-120px)] overflow-y-auto"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
