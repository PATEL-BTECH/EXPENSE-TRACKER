'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/AppLayout';
import StatsCard from '@/components/StatsCard';
import TransactionForm from '@/components/TransactionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Trash2
} from 'lucide-react';
import { Category, TransactionWithCategory, DashboardStats, TransactionFormData } from '@/types';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/currency';
import { formatCompactDateTime } from '@/lib/date-utils';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<TransactionWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use actual user ID
  const userId = user?._id?.toString();

  const createDefaultCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/seed-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
        toast.success('Default categories created');
      }
    } catch (error) {
      console.error('Error creating default categories:', error);
    }
  }, [userId]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch(`/api/categories?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setCategories(data.data);
        } else {
          // Create default categories if none exist
          console.log('No categories found, creating default categories...');
          await createDefaultCategories();
        }
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      // If there's an error, still try to create default categories
      await createDefaultCategories();
    }
  }, [userId, createDefaultCategories]);



  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Load categories first, create default ones if none exist
      await loadCategories();

      // Load dashboard stats
      const statsResponse = await fetch(`/api/dashboard?userId=${userId}`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data);
      }

      // Load recent transactions
      const transactionsResponse = await fetch(`/api/transactions?userId=${userId}&limit=5`);
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        setRecentTransactions(transactionsData.data || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [userId, loadCategories]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleAddTransaction = async (transactionData: TransactionFormData) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...transactionData, userId }),
      });

      if (response.ok) {
        toast.success('Transaction added successfully');
        // Force a fresh reload of dashboard data
        await loadDashboardData();
      } else {
        throw new Error('Failed to add transaction');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
      throw error;
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Transaction deleted successfully');
        // Reload dashboard data to reflect the deletion
        await loadDashboardData();
      } else {
        throw new Error('Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  const formatCurrencyValue = (amount: number) => {
    return formatCurrency(amount, 'INR');
  };



  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Track your income and expenses</p>
          </div>
          <TransactionForm
            categories={categories}
            onSubmit={handleAddTransaction}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Balance"
            value={stats?.balance || 0}
            icon={IndianRupee}
            trend={{ value: 0, isPositive: true }}
          />
          <StatsCard
            title="Total Income"
            value={stats?.totalIncome || 0}
            icon={TrendingUp}
            trend={{ value: 0, isPositive: true }}
            className="border-green-200"
          />
          <StatsCard
            title="Total Expenses"
            value={stats?.totalExpenses || 0}
            icon={TrendingUp}
            trend={{ value: 0, isPositive: true }}
            className="border-red-200"
          />
          <StatsCard
            title="Transactions"
            value={stats?.transactionCount || 0}
            icon={CreditCard}
            formatAsCurrency={false}
          />
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/transactions')}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">No transactions yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Add your first transaction to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction._id?.toString()}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-lg">{transaction.category?.icon || '📦'}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.category?.name} • {formatCompactDateTime(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant={transaction.type === 'income' ? 'default' : 'secondary'}
                        className={
                          transaction.type === 'income'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 mr-1" />
                        )}
                        {formatCurrencyValue(transaction.amount)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        onClick={() => handleDeleteTransaction(transaction._id?.toString() || '')}
                        title="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
