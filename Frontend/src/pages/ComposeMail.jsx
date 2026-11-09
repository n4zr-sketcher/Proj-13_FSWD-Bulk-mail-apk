/**
 * ComposeMail (Unslop pass)
 * Focused email composer with clean recipient parsing, template presets, and preview.
 * - Colors: rgb(57, 129, 246), rgb(241, 68, 68), rgb(245, 245, 245), rgb(220, 242, 255).
 * - Clean input states, sentence case, zero emoji.
 * - Precision Dispatch action button.
 */
import { useState, useMemo } from 'react';
import {
  HiOutlinePaperAirplane,
  HiOutlineEye,
  HiOutlineCodeBracket,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from 'react-icons/hi2';
import api from '../api/axios';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TEMPLATES = [
  {
    name: 'Product release',
    subject: 'Platform update: new delivery features now active',
    body: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; color: #111827; padding: 32px 24px;">
  <h2 style="font-size: 18px; font-weight: 600; margin-top: 0; color: #111827;">System update</h2>
  <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">We have updated our bulk email processing infrastructure to improve delivery speed and reliability.</p>
  <div style="background: #f0f7ff; border-left: 3px solid #3981f6; padding: 12px 16px; margin: 20px 0;">
    <p style="margin: 0; font-size: 13px; color: #1e3a8a;">All queued dispatches are now routed through verified Brevo relay endpoints with active bounce monitoring.</p>
  </div>
  <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">You can view the latest transmission logs in your workspace dashboard.</p>
  <p style="font-size: 13px; color: #9ca3af; margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 16px;">BulkMail Notification Service</p>
</div>`,
  },
  {
    name: 'Welcome note',
    subject: 'Your workspace access is ready',
    body: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 32px 24px; color: #111827;">
  <h2 style="font-size: 18px; font-weight: 600; margin-top: 0;">Welcome to BulkMail</h2>
  <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">Your administrative access has been verified. You can now compose campaigns and dispatch transactional messages to your verified recipient lists.</p>
  <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">If you have any questions about your sending quota, please contact your workspace administrator.</p>
</div>`,
  },
  {
    name: 'Maintenance',
    subject: 'Scheduled relay maintenance notice',
    body: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 32px 24px; color: #111827;">
  <h2 style="font-size: 18px; font-weight: 600; margin-top: 0; color: #f14444;">Maintenance schedule</h2>
  <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">We will perform scheduled updates on our email relay infrastructure on Sunday from 02:00 to 03:00 UTC.</p>
  <p style="font-size: 13px; color: #6b7280;">Outbound campaigns submitted during this window will be queued and sent immediately following completion.</p>
</div>`,
  },
];

export default function ComposeMail() {
  const [subject, setSubject] = useState('');
  const [recipientsInput, setRecipientsInput] = useState('');
  const [body, setBody] = useState(TEMPLATES[0].body);
  const [activeTab, setActiveTab] = useState('editor');
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  const { user } = useAuth();

  const rawList = useMemo(() => {
    if (!recipientsInput.trim()) return [];
    return recipientsInput
      .split(/[\n,;]+/)
      .map((e) => e.trim())
      .filter(Boolean);
  }, [recipientsInput]);

  const validRecipients = useMemo(() => rawList.filter((e) => EMAIL_REGEX.test(e)), [rawList]);
  const invalidRecipients = useMemo(() => rawList.filter((e) => !EMAIL_REGEX.test(e)), [rawList]);

  const isFormValid =
    subject.trim().length > 0 &&
    validRecipients.length > 0 &&
    body.trim().length > 0 &&
    !sending;

  const handleAddSelf = () => {
    if (!user?.email) return;
    const current = recipientsInput ? `${recipientsInput.trim()}, ` : '';
    if (!recipientsInput.includes(user.email)) {
      setRecipientsInput(`${current}${user.email}`);
    }
  };

  const handleApplyTemplate = (tmpl) => {
    setSubject(tmpl.subject);
    setBody(tmpl.body);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setSending(true);
    setToast(null);

    try {
      await api.post('/emails/send', {
        subject: subject.trim(),
        recipients: validRecipients,
        body: body.trim(),
      });

      setToast({
        message: `Campaign dispatched to ${validRecipients.length} recipient${validRecipients.length !== 1 ? 's' : ''}`,
        type: 'success',
      });

      setSubject('');
      setRecipientsInput('');
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to dispatch email';
      setToast({ message: msg, type: 'error' });
    } finally {
      setSending(false);
    }
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
            Compose campaign
          </h1>
          <p className="text-xs text-[#9ca3af] mt-1">
            Send bulk transactional messages via Brevo API relay
          </p>
        </div>

        {/* Template Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-[#64748b] mr-1">Presets:</span>
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.name}
              type="button"
              onClick={() => handleApplyTemplate(tmpl)}
              className="h-7 px-2.5 rounded-md bg-[#121722] hover:bg-[#171e2c] text-xs text-[#9ca3af] hover:text-[#dcf2ff] border border-[rgba(245,245,245,0.08)] hover:border-[#3981f6]/30 transition-colors cursor-pointer"
            >
              {tmpl.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSend} className="space-y-5">
        {/* Subject input */}
        <div className="unslop-card p-5 bg-[#121722] border border-[rgba(245,245,245,0.08)] space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="subject" className="text-xs text-[#f5f5f5] font-medium">
              Subject
            </label>
            <span className="text-xs text-[#64748b] tabular-nums font-mono">
              {subject.length} chars
            </span>
          </div>

          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full bg-[#0e121a] border border-[rgba(245,245,245,0.08)] rounded-md px-3.5 py-2 text-xs text-[#f5f5f5] placeholder-[#64748b] focus:outline-none focus:border-[#3981f6] focus:ring-1 focus:ring-[#3981f6]/30 transition-colors"
            placeholder="Subject line"
          />
        </div>

        {/* Recipients input */}
        <div className="unslop-card p-5 bg-[#121722] border border-[rgba(245,245,245,0.08)] space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="recipients" className="text-xs text-[#f5f5f5] font-medium">
              Recipients <span className="text-[#64748b] font-normal">(comma or newline separated)</span>
            </label>

            <button
              type="button"
              onClick={handleAddSelf}
              className="text-xs text-[#3981f6] hover:text-[#dcf2ff] underline transition-colors cursor-pointer"
            >
              + Add my email
            </button>
          </div>

          <textarea
            id="recipients"
            value={recipientsInput}
            onChange={(e) => setRecipientsInput(e.target.value)}
            rows={3}
            className="w-full bg-[#0e121a] border border-[rgba(245,245,245,0.08)] rounded-md px-3.5 py-2 text-xs font-mono text-[#f5f5f5] placeholder-[#64748b] focus:outline-none focus:border-[#3981f6] focus:ring-1 focus:ring-[#3981f6]/30 transition-colors resize-y"
            placeholder="alex@domain.com, jordan@company.org"
          />

          {rawList.length > 0 && (
            <div className="flex items-center gap-3 pt-1 text-xs tabular-nums">
              <span className="text-[#3981f6] flex items-center gap-1 font-mono">
                <HiOutlineCheckCircle size={13} />
                {validRecipients.length} valid
              </span>
              {invalidRecipients.length > 0 && (
                <span className="text-[#f14444] flex items-center gap-1 font-mono">
                  <HiOutlineExclamationCircle size={13} />
                  {invalidRecipients.length} invalid format
                </span>
              )}
            </div>
          )}
        </div>

        {/* Editor & Preview Viewport */}
        <div className="unslop-card bg-[#121722] border border-[rgba(245,245,245,0.08)] overflow-hidden">
          <div className="px-4 py-2 border-b border-[rgba(245,245,245,0.08)] flex items-center gap-2 bg-[#0e121a]">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-1.5 h-7 px-2.5 rounded text-xs transition-colors cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-[#3981f6]/10 text-[#dcf2ff] border border-[#3981f6]/30 font-medium'
                  : 'text-[#64748b] hover:text-[#f5f5f5]'
              }`}
            >
              <HiOutlineCodeBracket size={13} />
              <span>HTML editor</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 h-7 px-2.5 rounded text-xs transition-colors cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-[#3981f6]/10 text-[#dcf2ff] border border-[#3981f6]/30 font-medium'
                  : 'text-[#64748b] hover:text-[#f5f5f5]'
              }`}
            >
              <HiOutlineEye size={13} />
              <span>Preview</span>
            </button>
          </div>

          {activeTab === 'editor' ? (
            <div className="p-4">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={12}
                className="w-full bg-[#0e121a] border border-[rgba(245,245,245,0.08)] rounded-md p-3 font-mono text-xs text-[#f5f5f5] focus:outline-none focus:border-[#3981f6] focus:ring-1 focus:ring-[#3981f6]/30 resize-y leading-relaxed"
                placeholder="Enter email HTML markup..."
              />
            </div>
          ) : (
            <div className="p-6 bg-[#0e121a] min-h-[300px] flex items-center justify-center">
              <div
                className="w-full max-w-xl bg-white rounded-md p-6 text-slate-900 shadow-sm border border-slate-200"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            </div>
          )}
        </div>

        {/* Submit action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setSubject('');
              setRecipientsInput('');
              setBody(TEMPLATES[0].body);
            }}
            className="h-9 px-4 rounded-md text-xs text-[#9ca3af] hover:text-[#f14444] hover:bg-[#f14444]/10 hover:border-[#f14444]/25 border border-[rgba(245,245,245,0.08)] transition-colors cursor-pointer"
          >
            Clear form
          </button>

          <button
            type="submit"
            disabled={!isFormValid || sending}
            className="flex items-center gap-2 h-9 px-5 rounded-md bg-[#3981f6] hover:bg-[#2563eb] text-[#f5f5f5] font-medium text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            <HiOutlinePaperAirplane size={13} />
            <span>
              {sending
                ? 'Relaying dispatches...'
                : `Dispatch to ${validRecipients.length || 0} recipient${validRecipients.length !== 1 ? 's' : ''}`}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
