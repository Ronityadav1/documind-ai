
import React from 'react';

function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`message ${message.role}`}>
      <div className="role">
        {isUser ? 'YOU' : 'DOCUMIND AI'}
      </div>

      <div className="message-text">
        {message.text}
      </div>

      {message.sources && message.sources.length > 0 && (
        <div className="sources">
          <strong>
            Retrieved sources
          </strong>

          {message.sources.map((source, index) => (
            <details key={index}>
              <summary>
                Page {source.page} · excerpt {index + 1}
              </summary>

              <p>
                {source.excerpt}
              </p>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
