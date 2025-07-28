import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// Create the root and render the application.  React 18
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);