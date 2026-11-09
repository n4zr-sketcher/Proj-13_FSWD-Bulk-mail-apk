/**
 * Toast (Unslop pass - Light Theme)
 * Minimal notification toast adhering to the user's color palette:
 * - Success: rgb(57, 129, 246)
 * - Error: rgb(241, 68, 68)
 * - Surface: Clean White with subtle shadow
 */
import { useEffect, useState } from 'react';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineXMark } from 'react-icons/hi2';

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 200);
    }, 4000);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose?.(), 200);
  };

  const isSuccess = type === 'success';

  return (
    <div
      role="alert"
      className={`fixed top-5 right-5 z-[100] flex items-start gap-3 px-4 py-3 rounded-lg border bg-white border-[rgba(17,24,39,0.12)] shadow-xl transition-all duration-200 min-w-[300px] max-w-md ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div className="pt-0.5 shrink-0">
        {isSuccess ? (
          <HiOutlineCheckCircle className="text-[#3981f6]" size={16} />
        ) : (
          <HiOutlineExclamationCircle className="text-[#f14444]" size={16} />
        )}
      </div>

      <div className="flex-1 text-[13px] text-[#111827] leading-snug">
        {message}
      </div>

      <button
        type="button"
        onClick={handleClose}
        className="text-[#6b7280] hover:text-[#111827] transition-colors p-0.5 rounded cursor-pointer"
        aria-label="Dismiss notification"
      >
        <HiOutlineXMark size={14} />
      </button>
    </div>
  );
}
