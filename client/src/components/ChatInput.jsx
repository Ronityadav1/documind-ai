
import React from 'react';
import { Send } from 'lucide-react';

function ChatInput({
  document,
  question,
  onQuestionChange,
  onAsk,
  busy,
  error,
}) {
  function handleInputChange(event) {
    onQuestionChange(event.target.value);
  }

  return (
    <div className="composer-wrap">
      {error && (
        <div
          className="error"
          role="alert"
        >
          {error}
        </div>
      )}

      <form
        className="composer"
        onSubmit={onAsk}
      >
        <input
          type="text"
          placeholder={
            document
              ? 'Ask anything about your document...'
              : 'Upload a document to start asking questions'
          }
          value={question}
          onChange={handleInputChange}
          disabled={!document || busy}
          maxLength={1500}
        />

        <button
          type="submit"
          disabled={
            !document ||
            busy ||
            !question.trim()
          }
          aria-label="Send question"
        >
          <Send size={19} />
        </button>
      </form>

      <small>
        Answers are AI-generated. Verify important
        information against the source PDF.
      </small>
    </div>
  );
}

export default ChatInput;
