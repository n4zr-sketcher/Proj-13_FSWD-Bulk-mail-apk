/**
 * ComposeMail — email composition page for sending bulk emails.
 * Features subject input, recipients textarea with validation,
 * HTML body editor with collapsible preview, and send functionality.
 */
import { useState, useMemo } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import api from '../api/axios';
import Toast from '../components/Toast';

// Simple email regex for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ComposeMail() {
  const [subject, setSubject] = useState('');
  const [recipientsText, setRecipientsText] = useState('');
  const [body, setBody] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  // Parse and validate recipients from the textarea
  const parsedRecipients = useMemo(() => {
    if (!recipientsText.trim()) return [];

    // Split by newline, comma, or semicolon
    return recipientsText
      .split(/[\n,;]+/)
      .map((email) => email.trim())
      .filter(Boolean);
  }, [recipientsText]);

  const validEmails = parsedRecipients.filter((e) => EMAIL_REGEX.test(e));
  const invalidEmails = parsedRecipients.filter((e) => !EMAIL_REGEX.test(e));

  const isFormValid =
    subject.trim() && validEmails.length > 0 && body.trim() && !sending;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setSending(true);
    setToast(null);

    try {
      await api.post('/emails/send', {
        subject: subject.trim(),
        recipients: validEmails,
        body: body.trim(),
      });

      setToast({ message: `Emails sent to ${validEmails.length} recipients.`, type: 'success' });

      // Clear form on success
      setSubject('');
      setRecipientsText('');
      setBody('');
      setShowPreview(false);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to send emails. Please try again.';
      setToast({ message, type: 'error' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Compose Email</h1>
        <p className="text-neutral-500 text-sm mt-1">Create and send bulk emails</p>
      </div>

      {/* Compose form */}
      <form onSubmit={handleSend}>
        <div className="border border-neutral-200 rounded-sm p-6 space-y-6">
          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-xs uppercase tracking-wide text-neutral-500 mb-1.5">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-neutral-200 rounded-sm px-4 py-3 text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              placeholder="Email subject line"
            />
          </div>

          {/* Recipients */}
          <div>
            <label htmlFor="recipients" className="block text-xs uppercase tracking-wide text-neutral-500 mb-1.5">
              Recipients
            </label>
            <textarea
              id="recipients"
              value={recipientsText}
              onChange={(e) => setRecipientsText(e.target.value)}
              rows={4}
              className="w-full border border-neutral-200 rounded-sm px-4 py-3 text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-y"
              placeholder="Enter email addresses — one per line or comma-separated"
            />

            {/* Recipient count and validation feedback */}
            {parsedRecipients.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-3 text-xs">
                <span className="text-emerald-500">
                  {validEmails.length} valid recipient{validEmails.length !== 1 ? 's' : ''}
                </span>
                {invalidEmails.length > 0 && (
                  <span className="text-red-500">
                    {invalidEmails.length} invalid: {invalidEmails.join(', ')}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Email body */}
          <div>
            <label htmlFor="body" className="block text-xs uppercase tracking-wide text-neutral-500 mb-1.5">
              Email Body
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              className="w-full border border-neutral-200 rounded-sm px-4 py-3 text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-y min-h-[200px]"
              placeholder="Write your email content (HTML supported)"
            />
          </div>

          {/* Collapsible HTML preview */}
          <div className="border border-neutral-200 rounded-sm">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="w-full flex items-center justify-between px-4 py-3 text-xs uppercase tracking-wide text-neutral-500 hover:text-black transition-colors cursor-pointer"
            >
              <span>Preview</span>
              {showPreview ? <HiChevronUp size={16} /> : <HiChevronDown size={16} />}
            </button>

            {showPreview && (
              <div className="border-t border-neutral-200 px-4 py-4">
                {body.trim() ? (
                  <div
                    className="text-sm text-black prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: body }}
                  />
                ) : (
                  <p className="text-sm text-neutral-400">Nothing to preview yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm uppercase tracking-wide font-medium px-6 py-3 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              'Send Emails'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
