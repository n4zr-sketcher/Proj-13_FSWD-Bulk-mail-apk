/**
 * StatusBadge — renders a small box badge indicating email status.
 * Accepts 'sent', 'failed', or 'pending' as the status prop.
 * Uses color-coded background, text, and border for each state.
 */
const statusStyles = {
  sent: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  failed: 'bg-red-50 text-red-600 border border-red-200',
  pending: 'bg-amber-50 text-amber-600 border border-amber-200',
};

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || statusStyles.pending;

  return (
    <span className={`inline-block text-xs uppercase tracking-wide px-3 py-1 ${style}`}>
      {status}
    </span>
  );
}
