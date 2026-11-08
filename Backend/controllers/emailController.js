import SibApiV3Sdk from 'sib-api-v3-sdk';
import Email from '../models/Email.js';

// ─── POST /api/emails/send ───────────────────────────────────────────
/**
 * Send a bulk transactional email via Brevo (Sendinblue).
 * Body: { subject, body (HTML), recipients (array of email strings) }
 * Creates an Email record, sends via Brevo, and updates status.
 */
export const sendEmail = async (req, res) => {
  try {
    const { subject, body, recipients } = req.body;

    // Validate required fields
    if (!subject || !body || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        message: 'Please provide subject, body, and at least one recipient email address',
      });
    }

    // Clean and validate recipient list
    const cleanedRecipients = recipients
      .map((r) => (typeof r === 'string' ? r.trim() : ''))
      .filter((r) => r.length > 0);

    if (cleanedRecipients.length === 0) {
      return res.status(400).json({
        message: 'No valid recipient email addresses provided',
      });
    }

    // Verify Brevo API Key configuration
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey || brevoApiKey === 'your_brevo_api_key_here') {
      const emailRecord = await Email.create({
        subject,
        body,
        recipients: cleanedRecipients,
        status: 'failed',
        errorMessage: 'Brevo API key is not configured. Please set a valid BREVO_API_KEY in Backend/.env',
      });

      return res.status(400).json({
        message: 'Brevo API key is not configured. Please set BREVO_API_KEY in Backend/.env',
        email: emailRecord,
      });
    }

    // Create a pending email record in the database
    const emailRecord = await Email.create({
      subject,
      body,
      recipients: cleanedRecipients,
      status: 'pending',
    });

    console.log(`📧 Email record created (${emailRecord._id}), sending to ${cleanedRecipients.length} recipient(s)...`);

    try {
      // Configure Brevo client instance
      const defaultClient = SibApiV3Sdk.ApiClient.instance;
      const apiKey = defaultClient.authentications['api-key'];
      apiKey.apiKey = brevoApiKey;

      const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

      // Build the Brevo transactional email payload
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = body;
      sendSmtpEmail.sender = {
        name: process.env.SENDER_NAME || 'BulkMail Admin',
        email: process.env.SENDER_EMAIL || 'admin@example.com',
      };
      sendSmtpEmail.to = cleanedRecipients.map((email) => ({ email }));

      // Send the email via Brevo API
      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

      // Mark as sent
      emailRecord.status = 'sent';
      emailRecord.sentAt = new Date();
      await emailRecord.save();

      console.log(`✅ Email sent successfully (${emailRecord._id}). MessageId:`, result?.messageId || 'ok');

      res.status(200).json({
        message: 'Email sent successfully via Brevo',
        messageId: result?.messageId,
        email: emailRecord,
      });
    } catch (sendError) {
      // Extract detailed error description from Brevo SDK response
      const detailedMessage =
        sendError.response?.body?.message ||
        sendError.response?.text ||
        sendError.message ||
        'Unknown error sending through Brevo';

      // Mark as failed and store the error
      emailRecord.status = 'failed';
      emailRecord.errorMessage = detailedMessage;
      await emailRecord.save();

      console.error(`❌ Email send failed (${emailRecord._id}):`, detailedMessage);

      res.status(502).json({
        message: 'Failed to send email via Brevo',
        error: detailedMessage,
        email: emailRecord,
      });
    }
  } catch (error) {
    console.error('Send email controller error:', error.message);
    res.status(500).json({ message: 'Server error while processing email', error: error.message });
  }
};

// ─── GET /api/emails ─────────────────────────────────────────────────
/**
 * Retrieve all email records, sorted by creation date (newest first).
 */
export const getEmails = async (req, res) => {
  try {
    const emails = await Email.find().sort({ createdAt: -1 });
    res.json(emails);
  } catch (error) {
    console.error('Get emails error:', error.message);
    res.status(500).json({ message: 'Server error fetching emails', error: error.message });
  }
};

// ─── GET /api/emails/:id ────────────────────────────────────────────
/**
 * Retrieve a single email record by its MongoDB ID.
 */
export const getEmailById = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);

    if (!email) {
      return res.status(404).json({ message: 'Email record not found' });
    }

    res.json(email);
  } catch (error) {
    console.error('Get email by ID error:', error.message);
    res.status(500).json({ message: 'Server error fetching email', error: error.message });
  }
};

// ─── DELETE /api/emails/:id ──────────────────────────────────────────
/**
 * Delete an email record by its MongoDB ID.
 */
export const deleteEmail = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);

    if (!email) {
      return res.status(404).json({ message: 'Email record not found' });
    }

    await email.deleteOne();

    console.log(`🗑️ Email record deleted (${req.params.id})`);

    res.json({ message: 'Email record deleted successfully' });
  } catch (error) {
    console.error('Delete email error:', error.message);
    res.status(500).json({ message: 'Server error deleting email', error: error.message });
  }
};
