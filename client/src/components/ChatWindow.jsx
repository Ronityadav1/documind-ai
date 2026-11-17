
import React from 'react';
import { BookOpen } from 'lucide-react';

import ChatMessage from './ChatMessage.jsx';

function ChatWindow({
  document,
  messages,
  busy,
}) {
  return (
    <section className="conversation">
      {messages.length === 0 && (
        <div className="empty">
          <div className="empty-icon">
            <BookOpen size={34} />
          </div>

          <h2>
            Explore your document with AI
          </h2>

          <p>
            {document
              ? 'Your document is ready. Ask a question to get a grounded answer.'
              : 'Upload a PDF from the sidebar to begin.'}
          </p>

          <div className="hint">
            Try: "Summarize the key findings of this document."
          </div>
        </div>
      )}

      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          message={message}
        />
      ))}

      {busy && document && (
        <p className="loading">
          Working on your request...
        </p>
      )}
    </section>
  );
}

export default ChatWindow;
