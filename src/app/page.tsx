'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import HomePage from '@/components/HomePage';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      console.log('User found, redirecting to dashboard:', user.email);
      router.push('/dashboard');
    } else if (!isLoading && !user) {
      console.log('No user found, staying on home page');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show home page if not authenticated
  if (!user) {
    return <HomePage />;
  }

  // This shouldn't be reached due to the useEffect redirect, but just in case
  return null;
}
