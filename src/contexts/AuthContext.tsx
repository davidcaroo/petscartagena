"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'OWNER' | 'ADMIN';
  avatar?: string;
  bio?: string;
  phone?: string;
  address?: string;
  city?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      setToken(savedToken);
      // Verify token and get user info
      verifyToken(savedToken);
    } else {
      setIsLoading(false);
    }

    // Setup fetch interceptor to add auth header
    const originalFetch = window.fetch;
    window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
      const authToken = localStorage.getItem('auth_token');
      if (authToken) {
        const headers = new Headers(init?.headers);
        if (!headers.has('Authorization')) {
          headers.set('Authorization', `Bearer ${authToken}`);
        }
        init = { ...init, headers };
      }
      return originalFetch.call(this, input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/[...nextauth]', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        // Set token in cookie for middleware access
        document.cookie = `auth_token=${token}; path=/; max-age=604800; sameSite=strict`;
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('auth_token');
        setToken(null);
        // Clear cookie
        document.cookie = 'auth_token=; path=/; max-age=0; sameSite=strict';
      }
    } catch (error) {
      console.error('Token verification error:', error);
      localStorage.removeItem('auth_token');
      setToken(null);
      // Clear cookie
      document.cookie = 'auth_token=; path=/; max-age=0; sameSite=strict';
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/[...nextauth]', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('auth_token', data.token);
        
        // Set token in cookie for middleware access
        document.cookie = `auth_token=${data.token}; path=/; max-age=604800; sameSite=strict`;
        
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    // Clear cookie
    document.cookie = 'auth_token=; path=/; max-age=0; sameSite=strict';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}