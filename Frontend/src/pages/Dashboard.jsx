/**
 * Dashboard — overview page displaying email campaign statistics.
 * Shows three stat cards (Sent, Failed, Pending) and a recent emails table.
 * Fetches all emails from /emails and computes stats client-side.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all emails on mount
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

  // Compute stats from emails array
  const stats = {
    sent: emails.filter((e) => e.status === 'sent').length,
    failed: emails.filter((e) => e.status === 'failed').length,
    pending: emails.filter((e) => e.status === 'pending').length,
  };

  const recentEmails = emails.slice(0, 5);

  // Stat card configuration
  const statCards = [
    {
      label: 'Total Sent',
      value: stats.sent,
      borderColor: 'border-l-emerald-500',
      textColor: 'text-emerald-500',
    },
    {
      label: 'Failed',
      value: stats.failed,
      borderColor: 'border-l-red-500',
      textColor: 'text-red-500',
    },
    {
      label: 'Pending',
      value: stats.pending,
      borderColor: 'border-l-amber-500',
      textColor: 'text-amber-500',
    },
  ];

  // Format date to readable string
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
      <div className="flex items-center justify-center py-20">
        <p className="text-neutral-500 text-sm uppercase tracking-wide">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Dashboard</h1>
        <p className="text-neutral-500 text-sm mt-1">Overview of your email campaigns</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {statCards.map(({ label, value, borderColor, textColor }) => (
          <div
            key={label}
            className={`bg-white border border-neutral-200 p-6 border-l-4 ${borderColor}`}
          >
            <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">{label}</p>
            <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Recent emails */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-black">Recent Emails</h2>
          <Link
            to="/history"
            className="text-xs uppercase tracking-wide text-neutral-500 hover:text-black transition-colors"
          >
            View All →
          </Link>
        </div>

        {recentEmails.length === 0 ? (
          <div className="border border-neutral-200 p-8 text-center">
            <p className="text-neutral-500 text-sm">No emails sent yet.</p>
            <Link
              to="/compose"
              className="inline-block mt-3 text-sm text-emerald-500 hover:text-emerald-600 transition-colors"
            >
              Compose your first email →
            </Link>
          </div>
        ) : (
          <div className="border border-neutral-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="text-xs uppercase tracking-wide text-neutral-500 font-medium px-4 py-3">Subject</th>
                  <th className="text-xs uppercase tracking-wide text-neutral-500 font-medium px-4 py-3">Recipients</th>
                  <th className="text-xs uppercase tracking-wide text-neutral-500 font-medium px-4 py-3">Status</th>
                  <th className="text-xs uppercase tracking-wide text-neutral-500 font-medium px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {recentEmails.map((email) => (
                  <tr key={email._id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-black">{email.subject}</td>
                    <td className="px-4 py-3 text-sm text-neutral-500">
                      {email.recipients?.length || 0} recipient{(email.recipients?.length || 0) !== 1 ? 's' : ''}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={email.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-500">
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
