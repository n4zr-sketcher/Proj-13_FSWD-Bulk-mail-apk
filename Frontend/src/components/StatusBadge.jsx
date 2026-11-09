/**
 * StatusBadge (Unslop pass - Light Theme)
 * Minimalist semantic status tag tuned to user palette on light background:
 * - Delivered/Sent: Ice Blue background with Cobalt text (rgb(220, 242, 255) + rgb(57, 129, 246))
 * - Failed: Alert Red tint (rgb(241, 68, 68))
 * - Pending: Neutral slate tint (rgb(245, 245, 245))
 */
export default function StatusBadge({ status }) {
  const normalized = (status || 'pending').toLowerCase();

  const configs = {
    sent: {
      label: 'Delivered',
      bg: 'bg-[#dcf2ff] border-[#3981f6]/30 text-[#1d4ed8]',
      dot: 'bg-[#3981f6]',
    },
    delivered: {
      label: 'Delivered',
      bg: 'bg-[#dcf2ff] border-[#3981f6]/30 text-[#1d4ed8]',
      dot: 'bg-[#3981f6]',
    },
    failed: {
      label: 'Failed',
      bg: 'bg-[#fee2e2] border-[#f14444]/30 text-[#dc2626]',
      dot: 'bg-[#f14444]',
    },
    pending: {
      label: 'Pending',
      bg: 'bg-[#f1f5f9] border-[rgba(17,24,39,0.12)] text-[#6b7280]',
      dot: 'bg-[#6b7280]',
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
