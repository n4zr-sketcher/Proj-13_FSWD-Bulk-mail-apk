/**
 * StatusBadge — modern status indicator pill with glowing pulse dot.
 * Supported statuses: 'sent' | 'delivered' | 'failed' | 'pending' | 'queued'
 */
export default function StatusBadge({ status }) {
  const normalized = (status || 'pending').toLowerCase();

  const configs = {
    sent: {
      label: 'Delivered',
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      dot: 'bg-emerald-400',
      pulse: 'bg-emerald-400/50',
    },
    delivered: {
      label: 'Delivered',
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      dot: 'bg-emerald-400',
      pulse: 'bg-emerald-400/50',
    },
    failed: {
      label: 'Failed',
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      dot: 'bg-rose-400',
      pulse: 'bg-rose-400/50',
    },
    pending: {
      label: 'Pending',
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      dot: 'bg-amber-400',
      pulse: 'bg-amber-400/50',
    },
  };

  const current = configs[normalized] || configs.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase border backdrop-blur-sm ${current.bg}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.pulse}`}
        />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`} />
      </span>
      {current.label}
    </span>
  );
}
