
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';

// Global styles
import './styles/global.css';
import './styles/layout.css';

// Component styles
import './styles/Sidebar.css';
import './styles/UploadDocument.css';
import './styles/DocumentItem.css';
import './styles/Header.css';
import './styles/ChatWindow.css';
import './styles/ChatMessage.css';
import './styles/ChatInput.css';

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  <App />
);
