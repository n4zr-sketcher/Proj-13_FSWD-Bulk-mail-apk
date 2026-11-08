import mongoose from 'mongoose';

/**
 * Email Schema
 * Stores each bulk email send attempt with its status and metadata.
 */
const emailSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Email subject is required'],
  },
  body: {
    type: String,
    required: [true, 'Email body is required'],
  },
  recipients: {
    type: [String],
    required: [true, 'At least one recipient is required'],
    validate: {
      validator: (arr) => arr.length > 0,
      message: 'Recipients array must not be empty',
    },
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending',
  },
  sentAt: {
    type: Date,
  },
  errorMessage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Email = mongoose.model('Email', emailSchema);

export default Email;
