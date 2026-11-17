# DocuMind AI

A deployable PDF question-answering MVP using React, Express, FastAPI, Qdrant and Gemini.

## Architecture

React/Vite -> Express API gateway -> FastAPI (PDF extraction, chunking, local embeddings, vector search, grounded generation) -> Qdrant Cloud + Gemini.

This MVP is **single-user/demo-oriented**. It does not include authentication, user isolation, durable chat history, or scanned-PDF OCR. Do not upload confidential documents to a public demo.

## Requirements

- Node.js 20+
- Python 3.11+
- Qdrant Cloud collection endpoint and API key (or local Qdrant)
- Gemini API key

## Setup

### AI service

```bash
cd ai
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Windows: copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

The first run downloads the embedding model. Configure `QDRANT_URL`, `QDRANT_API_KEY`, and `GEMINI_API_KEY` in `ai/.env`.

### API gateway

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173. Upload a text-based PDF, then ask a question.

## API endpoints

- `GET /api/health`
- `POST /api/documents` (multipart field `file`, max 10MB)
- `POST /api/ask` (`{ "documentId": "...", "question": "..." }`)

## Deployment

1. Create a Qdrant Cloud cluster and obtain its HTTPS URL and API key.
2. Deploy `ai/` as a Python service on Render (root directory `ai`, build `pip install -r requirements.txt`, start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`). Set `QDRANT_URL`, `QDRANT_API_KEY`, `GEMINI_API_KEY`, `CORS_ORIGINS` (Express origin), and `HF_HOME` as appropriate. The embedding model loads at startup; choose a host with adequate RAM and disk. Free instances may cold-start.
3. Deploy `server/` as a Node service (root `server`, build `npm install`, start `npm start`). Set `AI_SERVICE_URL` to the Python service URL and `CLIENT_ORIGIN` to the Vercel frontend origin.
4. Deploy `client/` to Vercel (root `client`, framework Vite, build `npm run build`, output `dist`). Set `VITE_API_URL` to the Express service URL.
5. Redeploy after updating environment variables and test upload and ask end to end.

Do not expose API keys in frontend variables. Use HTTPS URLs in production. This is a portfolio MVP, not a multi-tenant production service. Add authentication, per-user authorization, rate limiting, persistence/cleanup policies and abuse protection before accepting public user uploads.

## Interview talking points

- Retrieval-augmented generation (RAG): split PDF pages, embed chunks, retrieve nearest chunks, send retrieved context to the LLM.
- Citations: retrieved chunks carry page metadata; the UI displays pages alongside the answer.
- Hallucination mitigation: prompt instructs the model to answer only from retrieved context; this reduces but does not eliminate hallucinations.
- Tradeoffs: local embedding model reduces per-request embedding costs, but consumes server resources; Qdrant stores vectors while Gemini generates answers.
