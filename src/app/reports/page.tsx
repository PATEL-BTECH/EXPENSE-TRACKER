
// =============================
// Reports Page Code
// =============================
'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  FileText,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  PieChart
} from 'lucide-react';
import { TransactionWithCategory } from '@/types';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/currency';
import { useAuth } from '@/contexts/AuthContext';
import { formatCompactDateTime } from '@/lib/date-utils';

interface ReportSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  transactionCount: number;
  avgTransactionAmount: number;
  topExpenseCategory: string;
  topIncomeCategory: string;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionWithCategory[]>([]);
  const [reportSummary, setReportSummary] = useState<ReportSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: 'all',
    category: 'all'
  });

  // Use actual user ID
  const userId = user?._id?.toString();

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/transactions?userId=${userId}&limit=1000`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.data || []);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Date filter
    if (filters.startDate) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.endDate));
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t.category?.name === filters.category);
    }

    setFilteredTransactions(filtered);
    generateReportSummary(filtered);
  };

  const generateReportSummary = (transactions: TransactionWithCategory[]) => {
    const income = transactions.filter(t => t.type === 'income');
    const expenses = transactions.filter(t => t.type === 'expense');

    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

    // Find top categories
    const expenseCategories = expenses.reduce((acc, t) => {
      const categoryName = t.category?.name || 'Other';
      acc[categoryName] = (acc[categoryName] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const incomeCategories = income.reduce((acc, t) => {
      const categoryName = t.category?.name || 'Other';
      acc[categoryName] = (acc[categoryName] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const topExpenseCategory = Object.entries(expenseCategories)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    const topIncomeCategory = Object.entries(incomeCategories)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    setReportSummary({
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      transactionCount: transactions.length,
      avgTransactionAmount: transactions.length > 0 ? 
        transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length : 0,
      topExpenseCategory,
      topIncomeCategory
    });
  };

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        `"${t.description}"`,
        `"${t.category?.name || 'Other'}"`,
        t.type,
        t.amount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Report exported successfully');
  };

  const formatCurrencyValue = (amount: number) => {
    return formatCurrency(amount, 'INR');
  };



  // Get unique categories for filter
  const uniqueCategories = Array.from(
    new Set(transactions.map(t => t.category?.name).filter(Boolean))
  );

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
            <p className="text-gray-600 dark:text-gray-300">Generate and export detailed financial reports</p>
          </div>
          <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Report Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income Only</SelectItem>
                    <SelectItem value="expense">Expenses Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category!}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Summary */}
        {reportSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Income</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrencyValue(reportSummary.totalIncome)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrencyValue(reportSummary.totalExpenses)}
                    </p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Income</p>
                    <p className={`text-2xl font-bold ${reportSummary.netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formatCurrencyValue(reportSummary.netIncome)}
                    </p>
                  </div>
                  <IndianRupee className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Transactions</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportSummary.transactionCount}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transaction Details */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details ({filteredTransactions.length} transactions)</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">No transactions found</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction._id?.toString()}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
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
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={transaction.type === 'income' ? 'default' : 'secondary'}
                        className={
                          transaction.type === 'income'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {transaction.type}
                      </Badge>
                      <span className={`font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrencyValue(transaction.amount)}
                      </span>
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
