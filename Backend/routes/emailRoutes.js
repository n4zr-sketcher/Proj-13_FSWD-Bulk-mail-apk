import express from 'express';
import {
  sendEmail,
  getEmails,
  getEmailById,
  deleteEmail,
} from '../controllers/emailController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// All email routes are protected — require valid JWT
router.use(protect);

// POST /api/emails/send — Send a bulk email via Brevo
router.post('/send', sendEmail);

// GET /api/emails — List all email records
router.get('/', getEmails);

// GET /api/emails/:id — Get a single email record
router.get('/:id', getEmailById);

// DELETE /api/emails/:id — Delete an email record
router.delete('/:id', deleteEmail);

export default router;
