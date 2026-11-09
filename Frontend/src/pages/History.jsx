/**
 * History (Unslop pass)
 * Complete transmission audit logs with quiet search, status filtering, and expandable inspect rows.
 * - Colors: rgb(57, 129, 246), rgb(241, 68, 68), rgb(245, 245, 245), rgb(220, 242, 255).
 * - Focused telemetry, tabular timestamps, and clean diagnostics.
 */
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineMagnifyingGlass,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineTrash,
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

  const fetchEmails = async () => {
    try {
      const res = await api.get('/emails');
      setEmails(res.data);
    } catch (err) {
      console.error('Failed to load history:', err);
      setToast({ message: 'Failed to load history records', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

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
      setToast({ message: 'Campaign record deleted', type: 'success' });
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      setToast({ message: 'Failed to delete record', type: 'error' });
    }
  };

  const handleCopyBody = (body, id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(body);
    setCopiedId(id);
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
          <h1 className="text-2xl font-normal tracking-tight text-[#f5f5f5]">
            Transmission logs
          </h1>
          <p className="text-xs text-[#9ca3af] mt-1">
            Complete audit trail of transactional dispatches and delivery statuses
          </p>
        </div>

        <button
          type="button"
          onClick={fetchEmails}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-[#121722] hover:bg-[#171e2c] text-xs text-[#9ca3af] hover:text-[#f5f5f5] border border-[rgba(245,245,245,0.08)] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <HiOutlineArrowPath size={13} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedFilter(tab)}
              className={`h-7 px-3 rounded-md text-xs transition-colors cursor-pointer ${
                selectedFilter === tab
                  ? 'bg-[#3981f6]/10 text-[#dcf2ff] border border-[#3981f6]/30 font-medium'
                  : 'bg-[#121722] hover:bg-[#171e2c] text-[#9ca3af] hover:text-[#f5f5f5] border border-[rgba(245,245,245,0.08)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <HiOutlineMagnifyingGlass
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]"
            size={14}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subject or recipient..."
            className="w-full h-8 bg-[#0e121a] border border-[rgba(245,245,245,0.08)] rounded-md pl-8 pr-7 text-xs text-[#f5f5f5] placeholder-[#64748b] focus:outline-none focus:border-[#3981f6] focus:ring-1 focus:ring-[#3981f6]/30 transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#f5f5f5]"
            >
              <HiOutlineXMark size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="unslop-card bg-[#121722] border border-[rgba(245,245,245,0.08)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#64748b]">
            Loading transmission records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-xs text-[#9ca3af]">No campaigns match your filter</p>
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="mt-2 text-xs text-[#3981f6] hover:text-[#dcf2ff] underline"
              >
                Clear search query
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#64748b] bg-[#0e121a] border-b border-[rgba(245,245,245,0.06)]">
                <tr>
                  <th className="py-2.5 px-4 font-normal">Subject</th>
                  <th className="py-2.5 px-4 font-normal">Recipients</th>
                  <th className="py-2.5 px-4 font-normal">Status</th>
                  <th className="py-2.5 px-4 font-normal">Timestamp</th>
                  <th className="py-2.5 px-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(245,245,245,0.06)]">
                {filtered.map((email) => {
                  const isExpanded = expandedId === email._id;
                  return (
                    <tr
                      key={email._id}
                      onClick={() => toggleExpand(email._id)}
                      className="hover:bg-[#171e2c] transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-medium text-[#f5f5f5] max-w-[240px] truncate">
                        {email.subject}
                      </td>
                      <td className="py-3 px-4 text-[#9ca3af] tabular-nums font-mono">
                        {email.recipients?.length || 0} recipient
                        {email.recipients?.length !== 1 ? 's' : ''}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={email.status} />
                      </td>
                      <td className="py-3 px-4 text-[#64748b] tabular-nums font-mono">
                        {formatDate(email.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleDelete(email._id, e)}
                            className="p-1 text-[#64748b] hover:text-[#f14444] hover:bg-[#f14444]/10 rounded transition-colors"
                            title="Delete record"
                          >
                            <HiOutlineTrash size={14} />
                          </button>
                          <div className="p-1 text-[#64748b] group-hover:text-[#f5f5f5]">
                            {isExpanded ? (
                              <HiOutlineChevronUp size={14} />
                            ) : (
                              <HiOutlineChevronDown size={14} />
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Expanded inspection details drawer */}
        {expandedId && (
          <div className="p-5 border-t border-[rgba(245,245,245,0.08)] bg-[#0e121a] space-y-4">
            {(() => {
              const current = emails.find((e) => e._id === expandedId);
              if (!current) return null;

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#9ca3af] font-medium">
                      Inspect dispatch: <span className="text-[#f5f5f5]">{current.subject}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleCopyBody(current.body, current._id, e)}
                        className="flex items-center gap-1 h-7 px-2.5 rounded text-xs text-[#9ca3af] hover:text-[#3981f6] border border-[rgba(245,245,245,0.08)] hover:border-[#3981f6]/30 transition-colors"
                      >
                        {copiedId === current._id ? (
                          <>
                            <HiOutlineCheck size={12} className="text-[#3981f6]" />
                            <span className="text-[#3981f6]">Copied HTML</span>
                          </>
                        ) : (
                          <span>Copy HTML</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedId(null)}
                        className="text-xs text-[#64748b] hover:text-[#f5f5f5] p-1"
                      >
                        <HiOutlineXMark size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Failure notice banner */}
                  {current.status === 'failed' && current.errorMessage && (
                    <div className="p-3 rounded-md bg-[#f14444]/10 border border-[#f14444]/25 text-[#f14444] text-xs space-y-1">
                      <div className="font-medium">Delivery failure diagnostic</div>
                      <div className="font-mono text-[11px] opacity-90">
                        {current.errorMessage}
                      </div>
                    </div>
                  )}

                  {/* Recipients list */}
                  <div>
                    <div className="text-[11px] text-[#64748b] uppercase tracking-wider mb-1.5">
                      Recipients ({current.recipients?.length || 0})
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                      {current.recipients?.map((r, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-xs font-mono bg-[#121722] border border-[rgba(245,245,245,0.08)] text-[#dcf2ff]"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* HTML Preview Frame */}
                  <div>
                    <div className="text-[11px] text-[#64748b] uppercase tracking-wider mb-1.5">
                      Rendered message content
                    </div>
                    <div className="p-4 rounded-md bg-white border border-slate-200 text-slate-900 max-h-60 overflow-y-auto text-xs">
                      <div dangerouslySetInnerHTML={{ __html: current.body }} />
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
