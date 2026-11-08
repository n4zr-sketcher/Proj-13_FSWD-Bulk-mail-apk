/**
 * ComposeMail — advanced bulk email composer with live template injection,
 * smart recipient tag manager, responsive live preview, and Brevo dispatch.
 */
import { useState, useMemo } from 'react';
import {
  HiOutlinePaperAirplane,
  HiOutlineSparkles,
  HiOutlineEye,
  HiOutlineCodeBracket,
  HiOutlineUserPlus,
  HiOutlineTrash,
  HiOutlineXMark,
  HiOutlineDocumentDuplicate,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineDevicePhoneMobile,
  HiOutlineComputerDesktop,
} from 'react-icons/hi2';
import api from '../api/axios';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Pre-crafted responsive email templates
const TEMPLATES = [
  {
    name: 'Product Launch',
    subject: '🚀 Introducing our latest platform updates',
    body: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; color: #1e293b;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #0d9488 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Major Platform Release</h1>
    <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Faster, more powerful, and designed for scale.</p>
  </div>
  <div style="padding: 32px 24px; line-height: 1.6;">
    <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">Hello team,</h2>
    <p style="font-size: 14px; color: #475569;">We are thrilled to announce that our latest features are now live for all users worldwide.</p>
    <div style="background: #f8fafc; border-left: 4px solid #10b981; padding: 16px; margin: 20px 0; border-radius: 4px;">
      <strong style="color: #0f172a; font-size: 14px;">Key Highlights:</strong>
      <ul style="margin: 8px 0 0; padding-left: 20px; font-size: 13px; color: #64748b;">
        <li>High-throughput Brevo delivery integration</li>
        <li>Real-time campaign status monitoring</li>
        <li>Enhanced mobile responsive templates</li>
      </ul>
    </div>
    <div style="text-align: center; margin: 32px 0 16px;">
      <a href="https://example.com" style="background: #10b981; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 600; display: inline-block;">Explore the Dashboard</a>
    </div>
  </div>
  <div style="background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
    Sent via BulkMail System • You are receiving this as a verified subscriber.
  </div>
</div>`,
  },
  {
    name: 'Welcome Onboarding',
    subject: '👋 Welcome aboard to BulkMail Platform',
    body: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px 24px; color: #0f172a;">
  <h1 style="color: #10b981; font-size: 22px; margin-top: 0;">Welcome to the Platform!</h1>
  <p style="font-size: 14px; line-height: 1.6; color: #475569;">Thank you for joining our community. Your account has been verified and your workspace is ready to send high-deliverability bulk notifications.</p>
  <p style="font-size: 14px; line-height: 1.6; color: #475569;">If you ever have any questions or feedback, simply hit reply to this email.</p>
  <p style="font-size: 14px; font-weight: 600; margin-top: 24px;">— The BulkMail Engineering Team</p>
</div>`,
  },
  {
    name: 'Important Alert',
    subject: '⚠️ Scheduled System Maintenance Notice',
    body: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #fee2e2; border-radius: 12px; padding: 32px 24px; color: #1e293b;">
  <h2 style="color: #ef4444; margin-top: 0;">Scheduled Maintenance Update</h2>
  <p style="font-size: 14px; color: #475569; line-height: 1.6;">Please be advised that we will be performing scheduled performance maintenance on our relay servers this Sunday between 02:00 UTC and 04:00 UTC.</p>
  <p style="font-size: 13px; color: #64748b; background: #fef2f2; padding: 12px; border-radius: 6px;">Expected downtime: None. Message dispatch queues will process seamlessly without disruption.</p>
</div>`,
  },
];

export default function ComposeMail() {
  const [subject, setSubject] = useState('');
  const [recipientsInput, setRecipientsInput] = useState('');
  const [body, setBody] = useState(TEMPLATES[0].body);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  const { user } = useAuth();

  // Parse recipients from input into clean unique array
  const rawList = useMemo(() => {
    if (!recipientsInput.trim()) return [];
    return recipientsInput
      .split(/[\n,;]+/)
      .map((e) => e.trim())
      .filter(Boolean);
  }, [recipientsInput]);

  const validRecipients = useMemo(() => rawList.filter((e) => EMAIL_REGEX.test(e)), [rawList]);
  const invalidRecipients = useMemo(() => rawList.filter((e) => !EMAIL_REGEX.test(e)), [rawList]);

  // Form validity check
  const isFormValid =
    subject.trim().length > 0 &&
    validRecipients.length > 0 &&
    body.trim().length > 0 &&
    !sending;

  // Quick insert sender's email for testing
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
    setToast({ message: `Loaded "${tmpl.name}" template`, type: 'success' });
  };

  const handleClearRecipients = () => {
    setRecipientsInput('');
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
        message: `Campaign dispatched to ${validRecipients.length} recipient(s) via Brevo!`,
        type: 'success',
      });

      // Clear subject and recipients after successful dispatch
      setSubject('');
      setRecipientsInput('');
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to dispatch campaign via Brevo.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
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
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold uppercase tracking-wider mb-2">
            <HiOutlineSparkles size={13} />
            <span>High Throughput Relay</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Compose Campaign
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Build high-converting emails and dispatch to unlimited contacts using Brevo's transactional API.
          </p>
        </div>

        {/* Quick Template Picker */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
            Presets:
          </span>
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.name}
              type="button"
              onClick={() => handleApplyTemplate(tmpl)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-neutral-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 transition-all cursor-pointer"
            >
              {tmpl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSend} className="space-y-6">
        {/* Subject line input */}
        <div className="rounded-2xl glass-panel p-5 sm:p-6 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="subject"
              className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2"
            >
              <HiOutlinePaperAirplane className="text-emerald-400 text-sm" />
              <span>Email Subject Line</span>
            </label>
            <span className="text-[11px] text-neutral-400 font-mono">
              {subject.length} chars
            </span>
          </div>

          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
            placeholder="e.g. 📢 Important Update: Your Account Access Has Been Upgraded"
          />
        </div>

        {/* Recipients input */}
        <div className="rounded-2xl glass-panel p-5 sm:p-6 border border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label
              htmlFor="recipients"
              className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2"
            >
              <HiOutlineUserPlus className="text-emerald-400 text-sm" />
              <span>Recipients List</span>
              <span className="text-neutral-500 text-[11px] font-normal lowercase">
                (separated by commas or new lines)
              </span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddSelf}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors cursor-pointer"
              >
                + Add My Email
              </button>
              {rawList.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearRecipients}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-rose-500/10 text-neutral-400 hover:text-rose-400 border border-white/10 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <HiOutlineTrash size={12} />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          <textarea
            id="recipients"
            value={recipientsInput}
            onChange={(e) => setRecipientsInput(e.target.value)}
            rows={3}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono resize-y"
            placeholder="alice@company.com, bob@org.net, user@domain.com"
          />

          {/* Validation summary bar */}
          {rawList.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold">
                <HiOutlineCheckCircle size={14} />
                {validRecipients.length} valid recipient{validRecipients.length !== 1 ? 's' : ''}
              </span>

              {invalidRecipients.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-semibold">
                  <HiOutlineExclamationTriangle size={14} />
                  {invalidRecipients.length} invalid format ({invalidRecipients.slice(0, 2).join(', ')}
                  {invalidRecipients.length > 2 ? '...' : ''})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Email Body Editor & Live Preview */}
        <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
          {/* Tab Bar */}
          <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'editor'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <HiOutlineCodeBracket size={14} />
                <span>HTML Code Editor</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <HiOutlineEye size={14} />
                <span>Live Viewport Preview</span>
              </button>
            </div>

            {/* Viewport switch for preview */}
            {activeTab === 'preview' && (
              <div className="hidden sm:flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-md text-xs cursor-pointer ${
                    previewDevice === 'desktop'
                      ? 'bg-emerald-500/30 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Desktop View"
                >
                  <HiOutlineComputerDesktop size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-md text-xs cursor-pointer ${
                    previewDevice === 'mobile'
                      ? 'bg-emerald-500/30 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Mobile View"
                >
                  <HiOutlineDevicePhoneMobile size={15} />
                </button>
              </div>
            )}
          </div>

          {/* Editor Mode */}
          {activeTab === 'editor' ? (
            <div className="p-4 sm:p-6">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={12}
                required
                className="w-full bg-[#070a11] border border-white/10 rounded-xl p-4 text-xs font-mono text-emerald-300 placeholder-neutral-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 leading-relaxed resize-y"
                placeholder="Write or paste your responsive HTML email structure here..."
              />
            </div>
          ) : (
            /* Live Preview Mode */
            <div className="p-6 bg-[#070a11]/90 flex justify-center min-h-[350px] overflow-auto">
              <div
                className={`transition-all duration-300 bg-white rounded-xl shadow-2xl p-4 overflow-auto border border-neutral-300 ${
                  previewDevice === 'mobile' ? 'w-[375px]' : 'w-full max-w-[650px]'
                }`}
              >
                {body.trim() ? (
                  <div dangerouslySetInnerHTML={{ __html: body }} />
                ) : (
                  <p className="text-center text-sm text-neutral-400 py-12">
                    Enter some content to preview your email.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Trigger Bar */}
        <div className="rounded-2xl glass-panel p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-neutral-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Ready to dispatch to <strong>{validRecipients.length}</strong> recipients</span>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || sending}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Transmitting to Brevo...</span>
              </>
            ) : (
              <>
                <HiOutlinePaperAirplane className="text-sm rotate-[-15deg]" />
                <span>Dispatch Campaign Now</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
