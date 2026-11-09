/**
 * StatusBadge (Unslop pass)
 * Minimalist semantic status tag tuned to user palette:
 * - Delivered/Sent: Blue/Ice theme (rgb(57, 129, 246) + rgb(220, 242, 255))
 * - Failed: Alert Red (rgb(241, 68, 68))
 * - Pending: Neutral slate (rgb(245, 245, 245) tint)
 */
export default function StatusBadge({ status }) {
  const normalized = (status || 'pending').toLowerCase();

  const configs = {
    sent: {
      label: 'Delivered',
      bg: 'bg-[#3981f6]/10 border-[#3981f6]/30 text-[#dcf2ff]',
      dot: 'bg-[#3981f6]',
    },
    delivered: {
      label: 'Delivered',
      bg: 'bg-[#3981f6]/10 border-[#3981f6]/30 text-[#dcf2ff]',
      dot: 'bg-[#3981f6]',
    },
    failed: {
      label: 'Failed',
      bg: 'bg-[#f14444]/10 border-[#f14444]/30 text-[#f14444]',
      dot: 'bg-[#f14444]',
    },
    pending: {
      label: 'Pending',
      bg: 'bg-[#dcf2ff]/5 border-[rgba(245,245,245,0.12)] text-[#9ca3af]',
      dot: 'bg-[#9ca3af]',
    },
  };

  const current = configs[normalized] || configs.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-normal border ${current.bg}`}
    >
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <span>{current.label}</span>
    </span>
  );
}
