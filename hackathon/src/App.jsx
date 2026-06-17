import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DocumentPage from './pages/Document';
import LanguageSelec from './pages/LanguageSelec';
import Schemes from './pages/Schemes';
import Upload from './pages/Upload';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/document" element={<DocumentPage />} />
          <Route path="/language" element={<LanguageSelec />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
