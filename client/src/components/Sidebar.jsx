
import React from 'react';
import { Sparkles } from 'lucide-react';

import UploadDocument from './UploadDocument.jsx';
import DocumentItem from './DocumentItem.jsx';

function Sidebar({
  file,
  onFileChange,
  onUpload,
  busy,
  document,
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <Sparkles size={23} />

        DocuMind <span>AI</span>
      </div>

      <p className="tagline">
        Your documents, understood.
      </p>

      <div className="side-title">
        DOCUMENT WORKSPACE
      </div>

      <UploadDocument
        file={file}
        onFileChange={onFileChange}
        onUpload={onUpload}
        busy={busy}
      />

      {document && (
        <DocumentItem document={document} />
      )}

      <div className="sidebar-bottom">
        Built with React · FastAPI · Qdrant · Gemini
      </div>
    </aside>
  );
}

export default Sidebar;
