
import React, { useState } from 'react';

import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import ChatInput from './components/ChatInput.jsx';

import {
  uploadDocument,
  askQuestion,
} from './services/api.js';

function App() {
  // Application state
  const [file, setFile] = useState(null);
  const [document, setDocument] = useState(null);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Upload a PDF document
  async function handleUpload(event) {
    event.preventDefault();

    if (!file || busy) {
      return;
    }

    setBusy(true);
    setError('');

    try {
      const data = await uploadDocument(file);

      setDocument(data);
      setMessages([]);
      setQuestion('');
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setBusy(false);
    }
  }

  // Send a question to the AI service
  async function handleAsk(event) {
    event.preventDefault();

    if (!document || !question.trim() || busy) {
      return;
    }

    const currentQuestion = question.trim();

    setQuestion('');
    setBusy(true);
    setError('');

    // Add the user's message to the conversation
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: 'user',
        text: currentQuestion,
      },
    ]);

    try {
      const data = await askQuestion(
        document.documentId,
        currentQuestion
      );

      // Add the AI response to the conversation
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: 'assistant',
          text: data.answer,
          sources: data.sources || [],
        },
      ]);
    } catch (askError) {
      setError(askError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="layout">
      <Sidebar
        file={file}
        onFileChange={setFile}
        onUpload={handleUpload}
        busy={busy}
        document={document}
      />

      <main className="main">
        <Header />

        <ChatWindow
          document={document}
          messages={messages}
          busy={busy}
        />

        <ChatInput
          document={document}
          question={question}
          onQuestionChange={setQuestion}
          onAsk={handleAsk}
          busy={busy}
          error={error}
        />
      </main>
    </div>
  );
}

export default App;