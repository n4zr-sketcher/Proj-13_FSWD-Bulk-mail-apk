/**
 * History (Unslop pass - Light Theme)
 * Complete transmission audit logs with quiet search, status filtering, and expandable inspect rows.
 * - Colors: rgb(57, 129, 246), rgb(241, 68, 68), rgb(245, 245, 245), rgb(220, 242, 255).
 * - Focused telemetry, tabular timestamps, and clean diagnostics on light cards.
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
          <h1 className="text-2xl font-normal tracking-tight text-[#111827]">
            Transmission logs
          </h1>
          <p className="text-xs text-[#4b5563] mt-1">
            Complete audit trail of transactional dispatches and delivery statuses
          </p>
        </div>

        <button
          type="button"
          onClick={fetchEmails}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-white hover:bg-[#f1f5f9] text-xs text-[#4b5563] hover:text-[#111827] border border-[rgba(17,24,39,0.08)] transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
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
                  ? 'bg-[#3981f6]/10 text-[#1d4ed8] border border-[#3981f6]/30 font-medium'
                  : 'bg-white hover:bg-[#f8fafc] text-[#4b5563] hover:text-[#111827] border border-[rgba(17,24,39,0.08)] shadow-2xs'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <HiOutlineMagnifyingGlass
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
            size={14}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subject or recipient..."
            className="w-full h-8 bg-white border border-[rgba(17,24,39,0.12)] rounded-md pl-8 pr-7 text-xs text-[#111827] placeholder-[#94a3b8] focus:outline-none focus:border-[#3981f6] focus:ring-1 focus:ring-[#3981f6]/30 transition-colors shadow-2xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#111827]"
            >
              <HiOutlineXMark size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="unslop-card bg-white border border-[rgba(17,24,39,0.08)] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#6b7280]">
            Loading transmission records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-xs text-[#4b5563]">No campaigns match your filter</p>
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="mt-2 text-xs text-[#3981f6] hover:text-[#1d4ed8] underline"
              >
                Clear search query
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#6b7280] bg-[#f8fafc] border-b border-[rgba(17,24,39,0.06)]">
                <tr>
                  <th className="py-2.5 px-4 font-normal">Subject</th>
                  <th className="py-2.5 px-4 font-normal">Recipients</th>
                  <th className="py-2.5 px-4 font-normal">Status</th>
                  <th className="py-2.5 px-4 font-normal">Timestamp</th>
                  <th className="py-2.5 px-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(17,24,39,0.06)]">
                {filtered.map((email) => {
                  const isExpanded = expandedId === email._id;
                  return (
                    <tr
                      key={email._id}
                      onClick={() => toggleExpand(email._id)}
                      className="hover:bg-[#f8fafc] transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-medium text-[#111827] max-w-[240px] truncate">
                        {email.subject}
                      </td>
                      <td className="py-3 px-4 text-[#4b5563] tabular-nums font-mono">
                        {email.recipients?.length || 0} recipient
                        {email.recipients?.length !== 1 ? 's' : ''}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={email.status} />
                      </td>
                      <td className="py-3 px-4 text-[#6b7280] tabular-nums font-mono">
                        {formatDate(email.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleDelete(email._id, e)}
                            className="p-1 text-[#94a3b8] hover:text-[#f14444] hover:bg-[#fee2e2]/40 rounded transition-colors"
                            title="Delete record"
                          >
                            <HiOutlineTrash size={14} />
                          </button>
                          <div className="p-1 text-[#94a3b8] group-hover:text-[#111827]">
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
          <div className="p-5 border-t border-[rgba(17,24,39,0.08)] bg-[#f8fafc] space-y-4">
            {(() => {
              const current = emails.find((e) => e._id === expandedId);
              if (!current) return null;

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#4b5563] font-medium">
                      Inspect dispatch: <span className="text-[#111827]">{current.subject}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleCopyBody(current.body, current._id, e)}
                        className="flex items-center gap-1 h-7 px-2.5 rounded text-xs bg-white text-[#4b5563] hover:text-[#3981f6] border border-[rgba(17,24,39,0.08)] hover:border-[#3981f6]/30 transition-colors shadow-2xs"
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
                        className="text-xs text-[#94a3b8] hover:text-[#111827] p-1"
                      >
                        <HiOutlineXMark size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Failure notice banner */}
                  {current.status === 'failed' && current.errorMessage && (
                    <div className="p-3 rounded-md bg-[#fee2e2] border border-[#f14444]/30 text-[#dc2626] text-xs space-y-1">
                      <div className="font-medium">Delivery failure diagnostic</div>
                      <div className="font-mono text-[11px] opacity-90">
                        {current.errorMessage}
                      </div>
                    </div>
                  )}

                  {/* Recipients list */}
                  <div>
                    <div className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-1.5 font-medium">
                      Recipients ({current.recipients?.length || 0})
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                      {current.recipients?.map((r, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-xs font-mono bg-white border border-[rgba(17,24,39,0.08)] text-[#1d4ed8] shadow-2xs"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* HTML Preview Frame */}
                  <div>
                    <div className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-1.5 font-medium">
                      Rendered message content
                    </div>
                    <div className="p-4 rounded-md bg-white border border-slate-200 text-slate-900 max-h-60 overflow-y-auto text-xs shadow-2xs">
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
