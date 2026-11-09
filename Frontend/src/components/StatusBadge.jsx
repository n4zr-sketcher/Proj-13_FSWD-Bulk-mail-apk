/**
 * StatusBadge (Unslop pass)
 * Quiet, deliberate status tag with a solid dot and toned semantic colors.
 * Zero pulsing animations or glows.
 */
export default function StatusBadge({ status }) {
  const normalized = (status || 'pending').toLowerCase();

  const configs = {
    sent: {
      label: 'Delivered',
      bg: 'bg-[#14231b] border-[#4cc38a]/20 text-[#4cc38a]',
      dot: 'bg-[#4cc38a]',
    },
    delivered: {
      label: 'Delivered',
      bg: 'bg-[#14231b] border-[#4cc38a]/20 text-[#4cc38a]',
      dot: 'bg-[#4cc38a]',
    },
    failed: {
      label: 'Failed',
      bg: 'bg-[#271415] border-[#e5484d]/20 text-[#e5484d]',
      dot: 'bg-[#e5484d]',
    },
    pending: {
      label: 'Pending',
      bg: 'bg-[#261f14] border-[#f59e0b]/20 text-[#f59e0b]',
      dot: 'bg-[#f59e0b]',
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
