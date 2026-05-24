import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [workerId, setWorkerId] = useState(localStorage.getItem('workproof_worker_id'));
  const [workerName, setWorkerName] = useState(localStorage.getItem('workproof_worker_name'));
  const [token, setToken] = useState(localStorage.getItem('workproof_token'));

  const login = (id, name, newToken) => {
    setWorkerId(id);
    setWorkerName(name);
    setToken(newToken);
    localStorage.setItem('workproof_worker_id', id);
    localStorage.setItem('workproof_worker_name', name);
    if (newToken) {
      localStorage.setItem('workproof_token', newToken);
    }
  };

  const logout = () => {
    setWorkerId(null);
    setWorkerName(null);
    setToken(null);
    localStorage.removeItem('workproof_worker_id');
    localStorage.removeItem('workproof_worker_name');
    localStorage.removeItem('workproof_token');
  };

  return (
    <AuthContext.Provider value={{ workerId, workerName, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
