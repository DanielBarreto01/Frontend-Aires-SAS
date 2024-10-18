import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './router/router';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/login/AuthContext'; 

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
            <Route path="/*" element={<AppRouter />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
