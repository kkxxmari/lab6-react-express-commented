import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
// I load my CSS after Bootstrap so my own styles can take priority.
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
// I attach my app to root and put the router around all the pages.
ReactDOM.createRoot(document.getElementById('root')).render(
  // I keep StrictMode to help spot problems during development.
  <React.StrictMode>
    {/* I use browser URLs for Home, Read and Create. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
