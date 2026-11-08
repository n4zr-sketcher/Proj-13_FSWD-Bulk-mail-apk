/**
 * Toast — a fixed-position notification that auto-dismisses after 4 seconds.
 * Supports 'success' and 'error' types with distinct left-border colors and icons.
 * Animates in from the right using CSS transitions.
 */
import { useEffect, useState } from 'react';
import { HiCheckCircle, HiXCircle, HiX } from 'react-icons/hi';

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(false);

  // Animate in on mount, auto-dismiss after 4 seconds
  useEffect(() => {
    // Trigger enter animation on next frame
    const enterTimer = requestAnimationFrame(() => setVisible(true));

    const dismissTimer = setTimeout(() => {
      setVisible(false);
      // Wait for exit animation before calling onClose
      setTimeout(() => onClose?.(), 200);
    }, 4000);

    return () => {
      cancelAnimationFrame(enterTimer);
      clearTimeout(dismissTimer);
    };
  }, [onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose?.(), 200);
  };

  const isSuccess = type === 'success';

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-start gap-3 bg-white border border-neutral-200 px-5 py-4 min-w-[320px] max-w-md transition-all duration-200 ${
        isSuccess ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-red-500'
      } ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
    >
      {/* Icon */}
      {isSuccess ? (
        <HiCheckCircle className="text-emerald-500 text-xl shrink-0 mt-0.5" />
      ) : (
        <HiXCircle className="text-red-500 text-xl shrink-0 mt-0.5" />
      )}

      {/* Message */}
      <p className="text-sm text-black flex-1">{message}</p>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="text-neutral-400 hover:text-black transition-colors cursor-pointer"
        aria-label="Close notification"
      >
        <HiX size={16} />
      </button>
    </div>
  );
}
