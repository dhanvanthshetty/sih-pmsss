// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token') || null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthState({ token });
    }
  }, []);

  const login = (token) => {
    setAuthState({ token });
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setAuthState({ token: null });
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
