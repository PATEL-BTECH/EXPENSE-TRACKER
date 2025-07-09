
// =============================
// Transactions Page Code
// =============================
'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import TransactionForm from '@/components/TransactionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Edit,
  Trash2
} from 'lucide-react';
import { Category, TransactionWithCategory, TransactionFormData } from '@/types';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/currency';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate, formatDateTime } from '@/lib/date-utils';

export default function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Use actual user ID
  const userId = user?._id?.toString();

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const createDefaultCategories = async () => {
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
  };

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Load categories
      const categoriesResponse = await fetch(`/api/categories?userId=${userId}`);
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.data && categoriesData.data.length > 0) {
          setCategories(categoriesData.data);
        } else {
          // Create default categories if none exist
          console.log('No categories found, creating default categories...');
          await createDefaultCategories();
        }
      } else {
        // If there's an error, still try to create default categories
        console.log('Error loading categories, creating default categories...');
        await createDefaultCategories();
      }

      // Load transactions
      const transactionsResponse = await fetch(`/api/transactions?userId=${userId}&limit=100`);
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData.data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async (transactionData: TransactionFormData) => {
    try {
      // Validate required fields
      if (!userId) {
        toast.error('User not authenticated');
        throw new Error('User not authenticated');
      }

      if (!transactionData.amount || !transactionData.description || !transactionData.categoryId) {
        toast.error('Please fill in all required fields');
        throw new Error('Missing required fields');
      }

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...transactionData, userId }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Transaction added successfully');
        loadData(); // Reload data
      } else {
        console.error('API Error:', result);
        toast.error(result.error || 'Failed to add transaction');
        throw new Error(result.error || 'Failed to add transaction');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      if (error instanceof Error && !error.message.includes('Failed to add transaction') && !error.message.includes('Missing required fields') && !error.message.includes('User not authenticated')) {
        toast.error('Network error: Please check your connection');
      }
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
        loadData(); // Reload data
      } else {
        throw new Error('Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrencyValue = (amount: number) => {
    return formatCurrency(amount, 'INR');
  };



  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage all your income and expenses</p>
          </div>
          <TransactionForm 
            categories={categories} 
            onSubmit={handleAddTransaction}
          />
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Transactions ({filteredTransactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-300">No transactions found</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'Try adjusting your search terms' : 'Add your first transaction to get started'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction._id?.toString()}>
                        <TableCell className="font-medium">
                          {transaction.description}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{transaction.category?.icon || '📦'}</span>
                            <span>{transaction.category?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDateTime(transaction.date)}</TableCell>
                        <TableCell>
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
                            {capitalizeFirstLetter(transaction.type)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrencyValue(transaction.amount)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteTransaction(transaction._id?.toString() || '')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
