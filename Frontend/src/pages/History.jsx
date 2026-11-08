/**
 * History — email history page showing all sent emails.
 * Features search by subject, expandable rows for details,
 * and load-more pagination.
 */
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HiChevronDown, HiChevronUp, HiSearch } from 'react-icons/hi';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

const PAGE_SIZE = 10;

export default function History() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Fetch all emails on mount
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await api.get('/emails');
        setEmails(res.data);
      } catch (err) {
        console.error('Failed to load email history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  // Filter emails by subject search query
  const filtered = useMemo(() => {
    if (!search.trim()) return emails;
    const q = search.toLowerCase();
    return emails.filter((email) =>
      email.subject?.toLowerCase().includes(q)
    );
  }, [emails, search]);

  const displayed = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
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
        <h1 className="text-2xl font-bold text-black">Email History</h1>
        <p className="text-neutral-500 text-sm mt-1">All your sent email campaigns</p>
      </div>

      {/* Search bar */}
      <div className="mb-6 relative">
        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          className="w-full border border-neutral-200 rounded-sm pl-10 pr-4 py-3 text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          placeholder="Search by subject..."
        />
      </div>

      {/* Email list */}
      {filtered.length === 0 ? (
        <div className="border border-neutral-200 rounded-sm p-8 text-center">
          <p className="text-neutral-500 text-sm">
            {emails.length === 0 ? 'No emails sent yet.' : 'No emails match your search.'}
          </p>
          {emails.length === 0 && (
            <Link
              to="/compose"
              className="inline-block mt-3 text-sm text-emerald-500 hover:text-emerald-600 transition-colors"
            >
              Compose your first email →
            </Link>
          )}
        </div>
      ) : (
        <div className="border border-neutral-200 rounded-sm overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 bg-neutral-50 px-4 py-3 gap-4">
            <span className="col-span-5 text-xs uppercase tracking-wide text-neutral-500 font-medium">Subject</span>
            <span className="col-span-2 text-xs uppercase tracking-wide text-neutral-500 font-medium">Recipients</span>
            <span className="col-span-2 text-xs uppercase tracking-wide text-neutral-500 font-medium">Status</span>
            <span className="col-span-3 text-xs uppercase tracking-wide text-neutral-500 font-medium">Sent At</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-neutral-200">
            {displayed.map((email) => (
              <div key={email._id}>
                {/* Main row — clickable to expand */}
                <button
                  onClick={() => toggleExpand(email._id)}
                  className="w-full text-left grid grid-cols-1 md:grid-cols-12 px-4 py-3 gap-2 md:gap-4 items-center hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <span className="md:col-span-5 text-sm text-black flex items-center gap-2">
                    {expandedId === email._id ? (
                      <HiChevronUp size={14} className="text-neutral-400 shrink-0" />
                    ) : (
                      <HiChevronDown size={14} className="text-neutral-400 shrink-0" />
                    )}
                    {email.subject}
                  </span>
                  <span className="md:col-span-2 text-sm text-neutral-500">
                    {email.recipients?.length || 0} recipients
                  </span>
                  <span className="md:col-span-2">
                    <StatusBadge status={email.status} />
                  </span>
                  <span className="md:col-span-3 text-sm text-neutral-500">
                    {new Date(email.createdAt).toLocaleString()}
                  </span>
                </button>

                {/* Expanded detail panel */}
                {expandedId === email._id && (
                  <div className="px-4 pb-4 pt-1 bg-neutral-50 border-t border-neutral-100">
                    <div className="space-y-4 pl-6">
                      {/* Recipient list */}
                      <div>
                        <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Recipients</p>
                        <div className="flex flex-wrap gap-1">
                          {email.recipients?.map((r, i) => (
                            <span
                              key={i}
                              className="text-xs bg-white border border-neutral-200 px-2 py-0.5 text-neutral-600"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Email body preview */}
                      <div>
                        <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Body Preview</p>
                        <div className="bg-white border border-neutral-200 p-3 text-sm text-black max-h-40 overflow-y-auto">
                          <div dangerouslySetInnerHTML={{ __html: email.body || '<em>No content</em>' }} />
                        </div>
                      </div>

                      {/* Error message if failed */}
                      {email.status === 'failed' && email.errorMessage && (
                        <div>
                          <p className="text-xs uppercase tracking-wide text-red-500 mb-1">Error</p>
                          <p className="text-sm text-red-600 bg-red-50 border border-red-200 p-3">{email.errorMessage}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="px-4 py-3 border-t border-neutral-200">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="text-sm text-neutral-500 hover:text-black uppercase tracking-wide transition-colors cursor-pointer"
              >
                Load More ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
