# Contributing to WorkProof

Thank you for considering contributing to **WorkProof – Financial Identity Platform**! We welcome contributions from the community.

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Python** (3.10+)
- **Git**

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/pranavhegde699-byte/fsem_pbl.git
   cd fsem_pbl
   ```

2. **Frontend Setup**
   ```bash
   cd hackathon
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

## 📋 How to Contribute

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes
- Follow the existing code style and conventions
- Write meaningful commit messages
- Test your changes locally before pushing

### 3. Commit & Push
```bash
git add .
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
```

### 4. Open a Pull Request
- Go to [the repo on GitHub](https://github.com/pranavhegde699-byte/fsem_pbl)
- Click **"Compare & Pull Request"**
- Describe your changes clearly

## 🏗️ Project Structure

```
fsem_pbl/
├── hackathon/         # React frontend (Vite + TailwindCSS)
│   └── src/
│       ├── pages/     # Page components (Login, Dashboard, etc.)
│       ├── components/# Reusable UI components
│       ├── api/       # API client functions
│       └── context/   # React context providers
├── backend/           # Django REST API
│   └── api/           # API views, models, utilities
└── README.md
```

## 🎨 Code Style Guidelines

- **Frontend**: Use React functional components with hooks
- **Backend**: Follow Django/DRF conventions
- **Naming**: Use `camelCase` for JS, `snake_case` for Python
- **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/) format

## 💡 Ideas for Contributions

- Add multilingual support (Hindi, Kannada, Tamil, etc.)
- Improve mobile responsiveness
- Add unit tests for frontend components
- Enhance accessibility (ARIA labels, keyboard navigation)
- Add data visualization charts to the dashboard
- Write API documentation

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Questions?** Open an issue or reach out to the maintainers. Happy coding! 🎉
