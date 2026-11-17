
import React from 'react';
import { UploadCloud } from 'lucide-react';

function UploadDocument({
  file,
  onFileChange,
  onUpload,
  busy,
}) {
  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0] || null;

    onFileChange(selectedFile);
  }

  return (
    <form
      className="upload-box"
      onSubmit={onUpload}
    >
      <UploadCloud size={28} />

      <strong>Upload a PDF</strong>

      <small>
        Text-based PDFs · up to 10 MB
      </small>

      <input
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleFileChange}
      />

      {file && (
        <small className="filename">
          {file.name}
        </small>
      )}

      <button
        type="submit"
        disabled={!file || busy}
      >
        {busy ? 'Processing...' : 'Process document'}
      </button>
    </form>
  );
}

export default UploadDocument;
