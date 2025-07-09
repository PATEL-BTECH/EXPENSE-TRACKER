// =============================
// Home Page Component (Landing Page)
// =============================
'use client';

// Importing required dependencies and UI components
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import { useState } from 'react';
import {
  DollarSign, // Icon for features
  PieChart,
  TrendingUp,
  Shield,
  Smartphone,
  BarChart3,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

// =============================
// Features List for Home Page
// =============================
const features = [
  {
    icon: DollarSign,
    title: 'Track Expenses',
    description: 'Easily categorize and monitor your income and expenses with intuitive transaction management.'
  },
  {
    icon: PieChart,
    title: 'Visual Analytics',
    description: 'Get insights into your spending patterns with beautiful charts and detailed financial reports.'
  },
  {
    icon: TrendingUp,
    title: 'Budget Management',
    description: 'Set budgets, track progress, and receive alerts when approaching your spending limits.'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your financial data is encrypted and stored securely with industry-standard protection.'
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Access your finances anywhere with our responsive design that works on all devices.'
  },
  {
    icon: BarChart3,
    title: 'Smart Reports',
    description: 'Generate detailed reports and export your data for tax preparation or financial planning.'
  }
];

// =============================
// Benefits List for Home Page
// =============================
const benefits = [
  'Real-time expense tracking',
  'Multiple currency support',
  'Custom categories and tags',
  'Budget alerts and notifications',
  'Data export capabilities',
  'Dark/Light mode support'
];

// =============================
// HomePage Component Definition
// =============================
export default function HomePage() {
  // State to control the modal for user options (New User / Already a User)
  const [showOptions, setShowOptions] = useState(false);
  // Handler to show the modal
  const handleGetStarted = () => setShowOptions(true);
  // Handler to close the modal
  const handleClose = () => setShowOptions(false);

  return (
    // Main Home Page Wrapper
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* ============================= */}
      {/* Header Section (Logo, Nav, Theme/Language) */}
      {/* ============================= */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">💰</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Budget Buddy</span>
            </div>

            {/* Navigation Buttons (Sign In, Get Started, Create Account) */}
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <ThemeToggle />
              <Link href="/login">
                <Button variant="outline" className="hidden sm:inline-flex">
                  Sign In
                </Button>
              </Link>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleGetStarted}>
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl animate-bounce" style={{ animationDuration: '1.5s' }}>
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ============================= */}
      {/* Hero Section (Main Banner) */}
      {/* ============================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Take Control of Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Finances</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Track expenses, manage budgets, and gain insights into your spending habits with our 
            modern, intuitive expense tracking application.
          </p>
          <div className="flex justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3" onClick={handleGetStarted}>
              Start Tracking Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/* Features Section (Feature Cards) */}
      {/* ============================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Manage Your Money
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to make expense tracking simple, insightful, and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/* Benefits Section (Why Choose Us) */}
      {/* ============================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose Budget Buddy?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Built with modern technology and user experience in mind, our platform offers 
                everything you need to take control of your financial life.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={handleGetStarted}>
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            <div className="relative">
              {/* Example Monthly Overview Card (Decorative) */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Monthly Overview</h3>
                    <span className="text-sm opacity-75">December 2024</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-lg p-4">
                      <p className="text-sm opacity-75">Total Income</p>
                      <p className="text-2xl font-bold">$5,240</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4">
                      <p className="text-sm opacity-75">Total Expenses</p>
                      <p className="text-2xl font-bold">$3,890</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="text-sm opacity-75">Savings This Month</p>
                    <p className="text-3xl font-bold text-green-300">$1,350</p>
                    <p className="text-sm opacity-75">↗ 12% from last month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/* CTA Section (Call to Action) */}
      {/* ============================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Financial Life?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who have taken control of their finances with Budget Buddy.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3" onClick={handleGetStarted}>
            Start Your Journey Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
      {/* ============================= */}
      {/* Modal for user options (New User / Already a User) */}
      {/* ============================= */}
      {showOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-sm w-full text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              onClick={handleClose}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Welcome!</h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Are you a new user or already have an account?</p>
            <div className="flex flex-col gap-4">
              <Link href="/register" onClick={handleClose}>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
                  New User
                </Button>
              </Link>
              <Link href="/login" onClick={handleClose}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
                  Already a User
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
        </div>
      </section>

      {/* ============================= */}
      {/* Footer Section */}
      {/* ============================= */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">💰</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Budget Buddy</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            ©  Budget Buddy. 
          </p>
        </div>
      </footer>
    </div>
  );
}
