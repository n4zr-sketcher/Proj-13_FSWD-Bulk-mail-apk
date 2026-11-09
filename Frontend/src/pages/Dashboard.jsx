/**
 * Dashboard (Unslop pass - Light Theme)
 * Deliberate, modern minimal campaign monitoring interface.
 * - Colors: rgb(57, 129, 246), rgb(241, 68, 68), rgb(245, 245, 245), rgb(220, 242, 255).
 * - Clean white cards, tabular metrics, calm atmospheric gradient.
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
      accent: 'text-[#1d4ed8]',
      borderTop: 'border-t-2 border-t-[#3981f6]',
    },
    {
      label: 'Failures',
      value: totalFailed,
      detail: totalFailed === 0 ? '0 delivery errors' : 'Dispatches rejected',
      accent: totalFailed > 0 ? 'text-[#f14444]' : 'text-[#111827]',
      borderTop: totalFailed > 0 ? 'border-t-2 border-t-[#f14444]' : 'border-t-2 border-t-transparent',
    },
    {
      label: 'Queued',
      value: totalPending,
      detail: 'In relay processing',
      accent: 'text-[#111827]',
      borderTop: 'border-t-2 border-t-transparent',
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
        <span className="text-xs text-[#6b7280] tracking-wider">
          Loading metrics...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-normal tracking-tight text-[#111827]">
            Campaign overview
          </h1>
          <p className="text-xs text-[#4b5563] mt-1">
            Real-time deliverability and transmission metrics via Brevo
          </p>
        </div>

        <Link
          to="/compose"
          className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md bg-[#3981f6] hover:bg-[#2563eb] text-white font-medium text-xs transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          <HiOutlinePlus size={14} />
          <span>New campaign</span>
        </Link>
      </div>

      {/* Modern Minimal Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`unslop-card p-5 bg-white border border-[rgba(17,24,39,0.08)] ${stat.borderTop} flex flex-col justify-between`}
          >
            <div>
              <div className="text-xs text-[#4b5563] font-normal">{stat.label}</div>
              <div
                className={`text-3xl font-normal tracking-tight mt-2 tabular-nums font-mono ${stat.accent}`}
              >
                {stat.value}
              </div>
            </div>
            <div className="text-xs text-[#6b7280] mt-3">{stat.detail}</div>
          </div>
        ))}
      </div>

      {/* Recent Dispatches Section */}
      <div className="unslop-card bg-white border border-[rgba(17,24,39,0.08)] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[rgba(17,24,39,0.08)] bg-[#f8fafc] flex items-center justify-between">
          <h2 className="text-xs font-medium text-[#111827]">Recent dispatches</h2>
          <Link
            to="/history"
            className="text-xs text-[#3981f6] hover:text-[#1d4ed8] flex items-center gap-1 transition-colors"
          >
            <span>View all</span>
            <HiOutlineArrowRight size={12} />
          </Link>
        </div>

        {recentEmails.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-xs text-[#4b5563]">No email campaigns sent yet</p>
            <Link
              to="/compose"
              className="inline-block mt-3 text-xs text-[#3981f6] hover:text-[#1d4ed8] underline"
            >
              Compose your first campaign
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#6b7280] bg-[#f8fafc] border-b border-[rgba(17,24,39,0.06)]">
                <tr>
                  <th className="py-2.5 px-4 font-normal">Subject</th>
                  <th className="py-2.5 px-4 font-normal">Recipients</th>
                  <th className="py-2.5 px-4 font-normal">Status</th>
                  <th className="py-2.5 px-4 font-normal text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(17,24,39,0.06)]">
                {recentEmails.map((email) => (
                  <tr
                    key={email._id}
                    className="hover:bg-[#f8fafc] transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-[#111827] max-w-[260px] truncate">
                      {email.subject}
                    </td>
                    <td className="py-3 px-4 text-[#4b5563] tabular-nums font-mono">
                      {email.recipients?.length || 0} recipient
                      {email.recipients?.length !== 1 ? 's' : ''}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={email.status} />
                    </td>
                    <td className="py-3 px-4 text-right text-[#6b7280] tabular-nums font-mono">
                      {formatDate(email.createdAt)}
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
