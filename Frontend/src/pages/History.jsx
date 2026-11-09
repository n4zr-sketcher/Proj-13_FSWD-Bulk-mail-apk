/**
 * History (Unslop pass)
 * Complete transmission audit logs with quiet search, status filtering, and expandable inspect rows.
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
    setToast({ message: 'HTML copied to clipboard', type: 'success' });
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
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="text-xs text-[#85858b] uppercase tracking-wider">
          Loading history
        </span>
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
          <h1 className="text-2xl font-normal tracking-tight text-[#ededed]">
            Campaign history
          </h1>
          <p className="text-xs text-[#a1a1a6] mt-1">
            Audit log of all outbound messages and delivery responses
          </p>
        </div>

        <button
          type="button"
          onClick={fetchEmails}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-[#1c1c1f] hover:bg-[#232325] text-xs text-[#a1a1a6] hover:text-[#ededed] border border-[rgba(237,237,237,0.08)] transition-colors cursor-pointer shrink-0"
        >
          <HiOutlineArrowPath size={13} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search & Filter row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[#85858b]" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#161618] border border-[rgba(237,237,237,0.08)] rounded-md pl-9 pr-8 py-2 text-xs text-[#ededed] placeholder-[#85858b] focus:outline-none focus:border-[#4cc38a] transition-colors"
            placeholder="Search campaigns"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#85858b] hover:text-[#ededed] p-0.5"
            >
              <HiOutlineXMark size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-[#161618] p-1 rounded-md border border-[rgba(237,237,237,0.08)] shrink-0 overflow-x-auto">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedFilter(tab)}
              className={`h-7 px-2.5 rounded text-xs font-normal transition-colors cursor-pointer ${
                selectedFilter === tab
                  ? 'bg-[#232325] text-[#ededed]'
                  : 'text-[#85858b] hover:text-[#ededed]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Campaign List */}
      {filtered.length === 0 ? (
        <div className="unslop-card p-12 text-center border border-[rgba(237,237,237,0.08)] bg-[#161618]">
          <p className="text-sm text-[#ededed]">No campaigns found</p>
          <p className="text-xs text-[#85858b] mt-1">
            {emails.length === 0
              ? 'No messages have been sent yet.'
              : 'No campaigns match your search query.'}
          </p>
        </div>
      ) : (
        <div className="unslop-card border border-[rgba(237,237,237,0.08)] bg-[#161618] overflow-hidden divide-y divide-[rgba(237,237,237,0.06)]">
          {filtered.map((email) => {
            const isExpanded = expandedId === email._id;

            return (
              <div key={email._id} className="transition-colors hover:bg-[#19191b]">
                <div
                  onClick={() => toggleExpand(email._id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="text-sm text-[#ededed] font-normal truncate">
                        {email.subject}
                      </span>
                      <StatusBadge status={email.status} />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#85858b]">
                      <span className="tabular-nums">
                        {email.recipients?.length || 0} recipient{(email.recipients?.length || 0) !== 1 ? 's' : ''}
                      </span>
                      <span>&bull;</span>
                      <span className="tabular-nums">
                        {formatDate(email.sentAt || email.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(email._id, e)}
                      className="p-1.5 rounded text-[#85858b] hover:text-[#e5484d] hover:bg-[#271415] transition-colors cursor-pointer"
                      title="Delete record"
                    >
                      <HiOutlineTrash size={15} />
                    </button>

                    <div className="text-[#85858b]">
                      {isExpanded ? <HiOutlineChevronUp size={15} /> : <HiOutlineChevronDown size={15} />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 bg-[#131315] border-t border-[rgba(237,237,237,0.06)] space-y-4">
                    {email.status === 'failed' && email.errorMessage && (
                      <div className="p-3 rounded-md bg-[#271415] border border-[#e5484d]/20 text-[#e5484d] text-xs">
                        <strong>Relay error:</strong> {email.errorMessage}
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-[#85858b] mb-1.5">Recipients ({email.recipients?.length || 0})</p>
                      <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pr-1">
                        {email.recipients?.map((r, i) => (
                          <span
                            key={i}
                            className="inline-block px-2 py-0.5 rounded bg-[#1c1c1f] border border-[rgba(237,237,237,0.08)] text-[11px] font-mono text-[#a1a1a6]"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs text-[#85858b]">Message preview</p>
                        <button
                          type="button"
                          onClick={(e) => handleCopyBody(email.body, email._id, e)}
                          className="inline-flex items-center gap-1 text-xs text-[#a1a1a6] hover:text-[#ededed] transition-colors cursor-pointer"
                        >
                          {copiedId === email._id ? <HiOutlineCheck size={12} /> : null}
                          <span>{copiedId === email._id ? 'Copied' : 'Copy HTML'}</span>
                        </button>
                      </div>

                      <div className="rounded-md border border-[rgba(237,237,237,0.08)] bg-white p-4 max-h-52 overflow-auto text-[#111827] text-xs">
                        <div dangerouslySetInnerHTML={{ __html: email.body || '<em>No content</em>' }} />
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
