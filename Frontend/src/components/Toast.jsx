/**
 * Toast — floating glassmorphic notification banner with auto-dismiss.
 */
import { useEffect, useState } from 'react';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineXMark } from 'react-icons/hi2';

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 250);
    }, 4500);

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
      className={`fixed top-20 right-5 z-[100] flex items-start gap-3.5 px-4 py-3.5 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 min-w-[320px] max-w-md ${
        isSuccess
          ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50'
          : 'bg-rose-950/80 border-rose-500/40 text-rose-200 shadow-rose-950/50'
      } ${
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-3 scale-95'
      }`}
    >
      <div className="pt-0.5 shrink-0">
        {isSuccess ? (
          <HiOutlineCheckCircle className="text-emerald-400 text-xl" />
        ) : (
          <HiOutlineExclamationCircle className="text-rose-400 text-xl" />
        )}
      </div>

      <div className="flex-1 text-xs font-medium leading-relaxed">
        <p className="font-semibold text-white mb-0.5">
          {isSuccess ? 'Success' : 'Notice'}
        </p>
        <p className="opacity-90">{message}</p>
      </div>

      <button
        onClick={handleClose}
        className="text-neutral-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 cursor-pointer"
        aria-label="Dismiss Notification"
      >
        <HiOutlineXMark size={16} />
      </button>
    </div>
  );
}
