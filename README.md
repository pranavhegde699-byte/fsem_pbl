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

- `MONGO_URI` – MongoDB connection string (default: `mongodb://localhost:27017/`)
- `MONGO_DB_NAME` – Database name (default: `workproof`)
- `GROQ_API_KEY` – *(optional)* API key for AI-powered document parsing. If not provided or if the API call fails, the system dynamically falls back to a robust local regex-based transaction parser.

## Architecture & Databases

- **MongoDB (App Data)**: Stores workers, scores, schemes, and documents collections via PyMongo.
- **SQLite (Django Meta)**: Used as the default Django application database (`db.sqlite3`) for system configurations.
- **AI Engine Fault Tolerance**: The scoring engine handles PDF parsing failure gracefully:
  1. **Tier 1 (AI)**: Groq LLM API (`llama-3.3-70b-versatile`) extracts and structures transaction summaries.
  2. **Tier 2 (Regex Parser)**: Falls back to a local regex parser that calculates inflow/outflow amounts, transaction counts, and consistency scores line-by-line.
  3. **Tier 3 (Static Mock)**: Returns a static base rating if both previous tiers fail, ensuring no runtime crashes.

## Team

- **pranavhegde699-byte** – Project Lead
- **Nishanth734** – Contributor
