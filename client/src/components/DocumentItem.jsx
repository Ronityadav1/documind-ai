
import React from 'react';
import { FileText } from 'lucide-react';

function DocumentItem({ document }) {
  if (!document) {
    return null;
  }

  return (
    <div className="doc-item">
      <FileText size={20} />

      <div>
        <strong>
          {document.filename}
        </strong>

        <small>
          {document.chunks} searchable chunks
        </small>
      </div>
    </div>
  );
}

export default DocumentItem;
