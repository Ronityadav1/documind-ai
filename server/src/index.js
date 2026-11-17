import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import rateLimit from 'express-rate-limit';

const app = express();
const port = Number(process.env.PORT || 4000);
const aiUrl = (process.env.AI_SERVICE_URL || 'http://localhost:8000')
  .replace(/\/$/, '');

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '20kb' }));

app.use('/api', rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
}));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// Forward requests to the Python AI service.
async function proxy(path, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120_000);

  try {
    const response = await fetch(`${aiUrl}${path}`, {
      ...options,
      signal: controller.signal,
    });

    const body = await response.json();

    return {
      status: response.status,
      body,
    };
  } finally {
    clearTimeout(timer);
  }
}

app.get('/api/health', async (_request, response) => {
  try {
    const result = await proxy('/health');
    response.status(result.status).json(result.body);
  } catch {
    response.status(503).json({ detail: 'AI service unavailable' });
  }
});

app.post('/api/documents', upload.single('file'), async (request, response) => {
  if (!request.file) {
    return response.status(400).json({ detail: 'Select a PDF file' });
  }

  const formData = new FormData();
  const pdfBlob = new Blob([request.file.buffer], {
    type: 'application/pdf',
  });

  formData.append('file', pdfBlob, request.file.originalname);

  try {
    const result = await proxy('/documents', {
      method: 'POST',
      body: formData,
    });

    response.status(result.status).json(result.body);
  } catch {
    response.status(503).json({ detail: 'AI service unavailable' });
  }
});

app.post('/api/ask', async (request, response) => {
  const { documentId, question } = request.body || {};

  const invalidRequest =
    typeof documentId !== 'string' ||
    typeof question !== 'string' ||
    !question.trim() ||
    question.length > 1500;

  if (invalidRequest) {
    return response.status(400).json({
      detail: 'Valid documentId and question are required',
    });
  }

  try {
    const result = await proxy('/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documentId, question }),
    });

    response.status(result.status).json(result.body);
  } catch {
    response.status(503).json({ detail: 'AI service unavailable' });
  }
});

app.use((error, _request, response, _next) => {
  if (error instanceof multer.MulterError) {
    return response.status(413).json({
      detail: 'File exceeds the 10MB upload limit',
    });
  }

  response.status(500).json({ detail: 'Unexpected server error' });
});

app.listen(port, () => {
  console.log(`DocuMind API listening on ${port}`);
});
