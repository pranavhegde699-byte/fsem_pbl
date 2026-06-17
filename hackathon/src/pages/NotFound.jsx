import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-lg text-gray-400 mb-6">Page not found</p>
      <Link to="/" className="px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition">
        Go Home
      </Link>
    </div>
  );
}
