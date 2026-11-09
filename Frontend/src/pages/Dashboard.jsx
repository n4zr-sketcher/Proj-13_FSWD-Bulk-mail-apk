/**
 * Dashboard (Unslop pass)
 * Deliberate, quiet campaign monitoring interface.
 * - Contextual headline ("Campaign overview" instead of "Welcome back 👋").
 * - Clean stat cards focused on tabular figures without decorative fluff.
 * - Quiet table with tabular dates and semantic status indicators.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineArrowRight } from 'react-icons/hi2';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const totalDelivered = emails.filter(
    (e) => e.status === 'sent' || e.status === 'delivered'
  ).length;
  const totalFailed = emails.filter((e) => e.status === 'failed').length;
  const totalPending = emails.filter((e) => e.status === 'pending').length;

  const totalRecipients = emails.reduce(
    (acc, email) => acc + (email.recipients?.length || 0),
    0
  );

  const recentEmails = emails.slice(0, 6);

  const stats = [
    {
      label: 'Delivered',
      value: totalDelivered,
      detail: `${totalRecipients} recipients total`,
      accent: 'text-[#4cc38a]',
    },
    {
      label: 'Failures',
      value: totalFailed,
      detail: totalFailed === 0 ? '0 bounces' : 'Delivery rejected',
      accent: totalFailed > 0 ? 'text-[#e5484d]' : 'text-[#ededed]',
    },
    {
      label: 'Queued',
      value: totalPending,
      detail: 'In relay processing',
      accent: 'text-[#ededed]',
    },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="text-xs text-[#85858b] uppercase tracking-wider">
          Loading metrics
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-normal tracking-tight text-[#ededed]">
            Campaign overview
          </h1>
          <p className="text-xs text-[#a1a1a6] mt-1">
            Real-time deliverability and transmission metrics via Brevo
          </p>
        </div>

        <Link
          to="/compose"
          className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md bg-[#ededed] hover:bg-white text-[#100e0b] font-medium text-xs transition-colors cursor-pointer shrink-0"
        >
          <HiOutlinePlus size={14} />
          <span>New campaign</span>
        </Link>
      </div>

      {/* 3 Quiet Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, detail, accent }) => (
          <div
            key={label}
            className="unslop-card p-5 border border-[rgba(237,237,237,0.08)] bg-[#161618]"
          >
            <p className="text-xs text-[#85858b] mb-2">{label}</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-medium tracking-tight tabular-nums ${accent}`}>
                {value}
              </span>
            </div>
            <p className="text-xs text-[#a1a1a6] mt-2">{detail}</p>
          </div>
        ))}
      </div>

      {/* Recent Dispatches Section */}
      <div className="unslop-card border border-[rgba(237,237,237,0.08)] bg-[#161618] overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[rgba(237,237,237,0.08)] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-[#ededed]">Recent campaigns</h2>
            <p className="text-xs text-[#85858b] mt-0.5">Latest dispatches from this workspace</p>
          </div>

          <Link
            to="/history"
            className="inline-flex items-center gap-1 text-xs text-[#a1a1a6] hover:text-[#ededed] transition-colors"
          >
            <span>View all</span>
            <HiOutlineArrowRight size={12} />
          </Link>
        </div>

        {recentEmails.length === 0 ? (
          <div className="py-14 text-center px-4">
            <p className="text-sm text-[#ededed]">No campaigns dispatched yet</p>
            <p className="text-xs text-[#85858b] mt-1 max-w-sm mx-auto">
              Create your first bulk email campaign using the composer.
            </p>
            <Link
              to="/compose"
              className="inline-flex items-center gap-1.5 mt-4 h-8 px-3 rounded-md bg-[#232325] text-xs text-[#ededed] hover:bg-[#2b2b2e] border border-[rgba(237,237,237,0.08)] transition-colors"
            >
              <HiOutlinePlus size={13} />
              <span>Compose first campaign</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[rgba(237,237,237,0.08)] text-[#85858b]">
                  <th className="px-5 py-3 font-normal">Subject</th>
                  <th className="px-5 py-3 font-normal">Recipients</th>
                  <th className="px-5 py-3 font-normal">Status</th>
                  <th className="px-5 py-3 font-normal text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(237,237,237,0.06)]">
                {recentEmails.map((email) => (
                  <tr key={email._id} className="hover:bg-[#1a1a1c] transition-colors">
                    <td className="px-5 py-3.5 text-[#ededed] font-normal truncate max-w-md">
                      {email.subject}
                    </td>
                    <td className="px-5 py-3.5 text-[#a1a1a6] tabular-nums">
                      {email.recipients?.length || 0} recipient{(email.recipients?.length || 0) !== 1 ? 's' : ''}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={email.status} />
                    </td>
                    <td className="px-5 py-3.5 text-[#85858b] text-right tabular-nums">
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
