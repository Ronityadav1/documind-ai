
const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:4000'
).replace(/\/$/, '');

async function readResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || data.error || 'Request failed'
    );
  }

  return data;
}

export async function uploadDocument(file) {
  const formData = new FormData();

  formData.append('file', file);

  const response = await fetch(
    `${API_URL}/api/documents`,
    {
      method: 'POST',
      body: formData,
    }
  );

  return readResponse(response);
}

export async function askQuestion(documentId, question) {
  const response = await fetch(
    `${API_URL}/api/ask`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documentId,
        question,
      }),
    }
  );

  return readResponse(response);
}
