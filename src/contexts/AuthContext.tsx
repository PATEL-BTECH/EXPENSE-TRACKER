'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { getUserIdFromEmail } from '@/lib/user-id';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginDemo: () => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to create default categories for a user
async function createDefaultCategoriesForUser(userId: string) {
  try {
    const response = await fetch('/api/seed-categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      console.log('Default categories created for user:', userId);
    }
  } catch (error) {
    console.error('Error creating default categories:', error);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated to avoid hydration mismatch
    setIsHydrated(true);

    // Check for stored user session
    try {
      const storedUser = localStorage.getItem('expense-tracker-user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('Restored user from localStorage:', parsedUser.email);
        setUser(parsedUser);
      } else {
        console.log('No stored user found in localStorage');
      }
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('expense-tracker-user');
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // For demo purposes, create a mock user
      // In a real app, this would make an API call to authenticate

      // Generate a consistent user ID based on email
      // This ensures the same user always gets the same ID across login sessions
      const userId = getUserIdFromEmail(email);

      const mockUser: User = {
        _id: userId as any, // Consistent ObjectId based on email
        email,
        name: email.split('@')[0],
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: {
          currency: 'INR',
          theme: 'system',
          language: 'en'
        }
      };

      setUser(mockUser);
      localStorage.setItem('expense-tracker-user', JSON.stringify(mockUser));
      console.log('User logged in and saved to localStorage:', mockUser.email);

      // Create default categories for new user
      await createDefaultCategoriesForUser(userId);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginDemo = async (): Promise<boolean> => {
    try {
      // Create a demo user with pre-defined data
      const demoUser: User = {
        _id: '507f1f77bcf86cd799439011' as any, // Fixed demo user ID
        email: 'demo@budgetbuddy.com',
        name: 'Demo User',
        avatar: '', // Will use default avatar
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: {
          currency: 'INR',
          theme: 'system',
          language: 'en'
        }
      };

      setUser(demoUser);
      localStorage.setItem('expense-tracker-user', JSON.stringify(demoUser));
      console.log('Demo user logged in and saved to localStorage:', demoUser.email);

      // Ensure demo user has categories and demo data
      await createDefaultCategoriesForUser(demoUser._id?.toString() || '');

      return true;
    } catch (error) {
      console.error('Demo login error:', error);
      return false;
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date()
    };

    setUser(updatedUser);
    localStorage.setItem('expense-tracker-user', JSON.stringify(updatedUser));
    console.log('User updated and saved to localStorage:', updatedUser.email);
  };

  const logout = () => {
    console.log('User logged out, clearing localStorage');
    setUser(null);
    localStorage.removeItem('expense-tracker-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginDemo, logout, updateUser, isLoading }}>
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
