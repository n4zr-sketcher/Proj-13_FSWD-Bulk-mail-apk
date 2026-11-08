/**
 * Dashboard — modernized analytics and campaign overview.
 * Features:
 * - Gradient hero greeting and quick-launch CTA
 * - Elevated glassmorphic stat cards with radiant glow
 * - Brevo engine health pill
 * - Recent dispatch activity with responsive table
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineClock,
  HiOutlinePaperAirplane,
  HiOutlineSparkles,
  HiOutlineArrowUpRight,
  HiOutlineEnvelopeOpen,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/emails');
        setEmails(res.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalSent = emails.filter((e) => e.status === 'sent' || e.status === 'delivered').length;
  const totalFailed = emails.filter((e) => e.status === 'failed').length;
  const totalPending = emails.filter((e) => e.status === 'pending').length;

  // Calculate total recipient count across all emails
  const totalRecipientsCount = emails.reduce(
    (acc, email) => acc + (email.recipients?.length || 0),
    0
  );

  const recentEmails = emails.slice(0, 5);

  const stats = [
    {
      label: 'Delivered Messages',
      value: totalSent,
      sublabel: `${totalRecipientsCount} total recipients reached`,
      icon: HiOutlineCheckCircle,
      glow: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      trend: 'Active',
      trendColor: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      label: 'Dispatch Failures',
      value: totalFailed,
      sublabel: 'Bounces or rejected addresses',
      icon: HiOutlineExclamationCircle,
      glow: 'from-rose-500/20 via-rose-500/5 to-transparent',
      borderColor: 'border-rose-500/30',
      iconColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      trend: totalFailed === 0 ? 'Optimal' : `${totalFailed} errors`,
      trendColor: totalFailed === 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10',
    },
    {
      label: 'Queued / In Flight',
      value: totalPending,
      sublabel: 'Pending Brevo relay transmission',
      icon: HiOutlineClock,
      glow: 'from-amber-500/20 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      trend: 'Real-time',
      trendColor: 'text-amber-400 bg-amber-500/10',
    },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-neutral-400 text-xs font-semibold uppercase tracking-widest">
          Syncing Campaign Metrics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl glass-panel p-6 sm:p-8 overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <HiOutlineShieldCheck className="text-sm" />
              <span>Brevo Engine Verified & Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                {user?.name || 'Admin'}
              </span>
            </h1>
            <p className="text-neutral-400 text-sm mt-1 max-w-xl">
              Monitor deliverability rates, review recent bulk dispatches, and trigger new campaigns with instant verification.
            </p>
          </div>

          <Link
            to="/compose"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shrink-0"
          >
            <HiOutlinePaperAirplane className="text-sm rotate-[-15deg]" />
            <span>Launch Campaign</span>
          </Link>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map(({ label, value, sublabel, icon: Icon, glow, borderColor, iconColor, trend, trendColor }) => (
          <div
            key={label}
            className={`relative rounded-2xl glass-card p-6 overflow-hidden border ${borderColor}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${glow} pointer-events-none`} />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-1">
                  {label}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {value}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${trendColor}`}>
                    {trend}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-2 font-medium">
                  {sublabel}
                </p>
              </div>

              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl border ${iconColor}`}>
                <Icon />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <HiOutlineEnvelopeOpen className="text-base" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Recent Dispatches</h2>
              <p className="text-xs text-neutral-400">Live transaction history from Brevo relays</p>
            </div>
          </div>

          <Link
            to="/history"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider transition-colors"
          >
            <span>View All History</span>
            <HiOutlineArrowUpRight size={14} />
          </Link>
        </div>

        {recentEmails.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 mx-auto mb-3">
              <HiOutlinePaperAirplane size={22} className="rotate-[-15deg]" />
            </div>
            <p className="text-sm font-semibold text-white">No campaigns sent yet</p>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              Ready to send your first bulk newsletter or notification? Launch a new campaign in seconds.
            </p>
            <Link
              to="/compose"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider hover:bg-emerald-500/30 transition-colors"
            >
              <HiOutlineSparkles />
              <span>Compose First Email</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-5 py-3 text-[11px] uppercase font-bold tracking-wider text-neutral-400">
                    Subject Line
                  </th>
                  <th className="px-5 py-3 text-[11px] uppercase font-bold tracking-wider text-neutral-400">
                    Audience
                  </th>
                  <th className="px-5 py-3 text-[11px] uppercase font-bold tracking-wider text-neutral-400">
                    Delivery Status
                  </th>
                  <th className="px-5 py-3 text-[11px] uppercase font-bold tracking-wider text-neutral-400">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-medium">
                {recentEmails.map((email) => (
                  <tr key={email._id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-semibold text-white block max-w-md truncate">
                        {email.subject}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-mono text-[11px]">
                        {email.recipients?.length || 0} recipient{(email.recipients?.length || 0) !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={email.status} />
                    </td>
                    <td className="px-5 py-4 text-neutral-400">
                      {formatDate(email.sentAt || email.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
