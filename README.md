# WorkProof – Financial Identity Platform

A full-stack web application that helps gig workers and freelancers build a verifiable financial identity based on their work history.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend  | Django, Django REST Framework       |
| Database | MongoDB (via PyMongo)               |
| AI       | Groq API (document parsing)         |
| PDF      | ReportLab, pdfplumber               |

## Project Structure

```
fsem_pbl/
├── backend/            # Django API server
│   ├── api/            # Core app (views, models, scoring engine)
│   ├── workproof_backend/  # Django project settings
│   ├── manage.py
│   └── requirements.txt
├── hackathon/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── api/
│   ├── index.html
│   └── package.json
└── .gitignore
```

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env         # Edit with your MongoDB URI
python manage.py runserver
```

### Frontend

```bash
cd hackathon
npm install
npm run dev
```

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

- `MONGO_URI` – MongoDB connection string
- `MONGO_DB_NAME` – Database name (default: `workproof`)
- `GROQ_API_KEY` – *(optional)* API key for AI-powered document parsing

## Team

- **pranavhegde699-byte** – Project Lead
- **Nishanth734** – Contributor
