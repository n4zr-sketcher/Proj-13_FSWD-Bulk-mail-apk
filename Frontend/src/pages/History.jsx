/**
 * History — comprehensive email dispatch logs.
 * Features:
 * - Search by subject or recipient
 * - Filter by status (All, Delivered, Failed, Pending)
 * - Expandable cards with HTML preview, recipient chips, and error diagnosis
 * - One-click delete and copy functionality
 */
import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineMagnifyingGlass,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineTrash,
  HiOutlineClock,
  HiOutlineEnvelope,
  HiOutlineArrowPath,
  HiOutlineXMark,
  HiOutlineCheck,
} from 'react-icons/hi2';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import Toast from '../components/Toast';

const FILTER_TABS = ['All', 'Delivered', 'Failed', 'Pending'];

export default function History() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [toast, setToast] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const navigate = useNavigate();

  const fetchEmails = async () => {
    try {
      const res = await api.get('/emails');
      setEmails(res.data);
    } catch (err) {
      console.error('Failed to load history:', err);
      setToast({ message: 'Failed to fetch email history from server', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  // Filter emails based on search query and tab status
  const filtered = useMemo(() => {
    return emails.filter((email) => {
      const matchesSearch =
        email.subject?.toLowerCase().includes(search.toLowerCase()) ||
        email.recipients?.some((r) => r.toLowerCase().includes(search.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedFilter === 'All') return true;
      if (selectedFilter === 'Delivered') return email.status === 'sent' || email.status === 'delivered';
      if (selectedFilter === 'Failed') return email.status === 'failed';
      if (selectedFilter === 'Pending') return email.status === 'pending';

      return true;
    });
  }, [emails, search, selectedFilter]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/emails/${id}`);
      setEmails((prev) => prev.filter((item) => item._id !== id));
      setToast({ message: 'Campaign record deleted successfully', type: 'success' });
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      setToast({ message: 'Failed to delete email record', type: 'error' });
    }
  };

  const handleCopyBody = (body, id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(body);
    setCopiedId(id);
    setToast({ message: 'Email HTML copied to clipboard', type: 'success' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-US', {
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
          Loading Transmission Logs...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dispatch History
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Complete audit trail of all bulk email campaigns and Brevo delivery events.
          </p>
        </div>

        <button
          onClick={fetchEmails}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
        >
          <HiOutlineArrowPath size={14} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Search Bar & Filter Pills */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
            placeholder="Search by subject or recipient email..."
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
            >
              <HiOutlineXMark size={16} />
            </button>
          )}
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 shrink-0 overflow-x-auto">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === tab
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl glass-panel p-12 text-center border border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 mx-auto mb-3">
            <HiOutlineEnvelope size={22} />
          </div>
          <p className="text-sm font-semibold text-white">No campaigns found</p>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            {emails.length === 0
              ? 'No emails have been dispatched yet. Send your first campaign from the compose window.'
              : 'No campaigns match your search and filter criteria.'}
          </p>
          {emails.length === 0 && (
            <Link
              to="/compose"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider hover:bg-emerald-500/30 transition-colors"
            >
              Compose Campaign Now
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden divide-y divide-white/5">
          {filtered.map((email) => {
            const isExpanded = expandedId === email._id;

            return (
              <div key={email._id} className="transition-colors hover:bg-white/[0.02]">
                {/* Collapsible Row Header */}
                <div
                  onClick={() => toggleExpand(email._id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-white text-sm truncate">
                        {email.subject}
                      </span>
                      <StatusBadge status={email.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                      <span className="font-mono text-neutral-300">
                        {email.recipients?.length || 0} recipient{(email.recipients?.length || 0) !== 1 ? 's' : ''}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <HiOutlineClock size={13} />
                        {formatDate(email.sentAt || email.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(email._id, e)}
                      className="p-2 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete Record"
                    >
                      <HiOutlineTrash size={16} />
                    </button>

                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400">
                      {isExpanded ? <HiOutlineChevronUp size={16} /> : <HiOutlineChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 bg-black/40 border-t border-white/5 space-y-4">
                    {/* Error diagnostic banner if failed */}
                    {email.status === 'failed' && email.errorMessage && (
                      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs leading-relaxed">
                        <strong className="block font-bold text-rose-200 mb-1">Brevo Error Log:</strong>
                        {email.errorMessage}
                      </div>
                    )}

                    {/* Recipients Chips */}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                        Delivered Recipients ({email.recipients?.length || 0})
                      </p>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-2">
                        {email.recipients?.map((r, i) => (
                          <span
                            key={i}
                            className="inline-block px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-300"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* HTML Preview Box */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                          Message Body Preview
                        </p>
                        <button
                          type="button"
                          onClick={(e) => handleCopyBody(email.body, email._id, e)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                        >
                          {copiedId === email._id ? <HiOutlineCheck size={13} /> : null}
                          <span>{copiedId === email._id ? 'Copied' : 'Copy HTML'}</span>
                        </button>
                      </div>

                      <div className="rounded-xl border border-neutral-300 bg-white p-4 max-h-56 overflow-auto text-black">
                        <div dangerouslySetInnerHTML={{ __html: email.body || '<em>No body content</em>' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
