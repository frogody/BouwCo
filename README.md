# AI-Powered Construction Cost Estimation Tool

A full-stack application that uses AI to analyze construction drawings and provide accurate cost estimates.

## Features

- Upload and analyze 2D floor plans and elevation drawings
- AI-powered element detection (walls, doors, windows, etc.)
- Accurate cost estimation based on detected elements
- Export results to PDF and Excel
- Tiered access model (Free, Professional, Enterprise)

## Tech Stack

- Frontend: Next.js/React
- Backend: FastAPI (Python)
- Database: PostgreSQL
- AI: YOLOv5/Mask R-CNN for object detection
- Authentication: JWT-based auth with tiered access

## Project Structure

```
project-root/
├── frontend/              # Next.js app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Next.js pages (routes)
│   │   └── utils/        # Helper functions
├── backend/
│   ├── app/              # FastAPI application
│   │   ├── main.py       # FastAPI initialization
│   │   ├── ai_module.py  # AI processing
│   │   ├── models.py     # Database models
│   │   └── auth.py       # Authentication
│   └── tests/            # Backend tests
├── migrations/           # Database migrations
└── docker-compose.yml    # Docker configuration
```

## Getting Started

### Prerequisites

- Node.js 16+
- Python 3.10+
- PostgreSQL
- Docker (optional)

### Development Setup

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Start the development servers:
   ```bash
   # Terminal 1 - Frontend
   cd frontend
   npm run dev

   # Terminal 2 - Backend
   cd backend
   uvicorn app.main:app --reload
   ```

### Docker Setup

```bash
docker-compose up --build
```

## Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 