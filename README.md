# BulkMail — Full Stack Bulk Email Application

A MERN stack application for sending and managing bulk emails using Brevo (Sendinblue) transactional email API.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19, Tailwind CSS 4, Vite 8    |
| Backend  | Node.js, Express 5                  |
| Database | MongoDB, Mongoose                   |
| Email    | Brevo (Sendinblue) Transactional API|
| Auth     | JWT, bcryptjs                       |

## Features

- **Compose & Send** — Write subject, body, and add multiple recipients
- **Brevo Integration** — Emails sent via Brevo's transactional email API
- **Email History** — View all previously sent emails with status
- **Dashboard** — Overview stats (sent, failed, pending)
- **Admin Auth** — JWT-based login/register system
- **Responsive UI** — Minimalist black/white/green design

## Project Structure

```
Proj13_Bulk-mail_app/
├── Frontend/          # React + Vite + Tailwind CSS
│   └── src/
│       ├── api/       # Axios config
│       ├── context/   # Auth context
│       ├── components/# Reusable UI components
│       └── pages/     # Page components
├── Backend/           # Node.js + Express
│   ├── config/        # Database config
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── controllers/   # Business logic
│   └── middleware/     # Auth middleware
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Brevo account with API key

### 1. Backend Setup

```bash
cd Backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm start
```

### 2. Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

### 3. Environment Variables

Create `Backend/.env` from `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bulkmail
JWT_SECRET=your_jwt_secret_here
BREVO_API_KEY=your_brevo_api_key_here
SENDER_EMAIL=your_verified_sender@example.com
SENDER_NAME=BulkMail App
```

### 4. Brevo Setup

1. Create a free account at [brevo.com](https://www.brevo.com)
2. Go to **SMTP & API** → **API Keys** → Generate a new key
3. Add the key to `BREVO_API_KEY` in `.env`
4. Verify your sender email in Brevo dashboard

## API Endpoints

### Auth
| Method | Endpoint             | Description      | Auth |
|--------|----------------------|------------------|------|
| POST   | `/api/auth/register` | Register admin   | No   |
| POST   | `/api/auth/login`    | Login            | No   |
| GET    | `/api/auth/profile`  | Get profile      | Yes  |

### Emails
| Method | Endpoint             | Description      | Auth |
|--------|----------------------|------------------|------|
| POST   | `/api/emails/send`   | Send bulk email  | Yes  |
| GET    | `/api/emails`        | Get all emails   | Yes  |
| GET    | `/api/emails/:id`    | Get email by ID  | Yes  |
| DELETE | `/api/emails/:id`    | Delete email     | Yes  |

## License

MIT

