'use client';

import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import ExpenseChart from '@/components/ExpenseChart';
import StatsCard from '@/components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  IndianRupee,
  PieChart,
  BarChart3,
  Target
} from 'lucide-react';
import { TransactionWithCategory, Category } from '@/types';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/currency';
import { useAuth } from '@/contexts/AuthContext';

interface AnalyticsData {
  expenseCategoryBreakdown: Array<{ name: string; value: number; color: string }>;
  incomeCategoryBreakdown: Array<{ name: string; value: number; color: string }>;
  monthlyTrend: Array<{ name: string; income: number; expenses: number; value: number }>;
  monthlyIncome: Array<{ name: string; value: number }>;
  monthlyExpenses: Array<{ name: string; value: number }>;
  topExpenseCategories: Array<{ category: string; amount: number; transactions: number }>;
  topIncomeCategories: Array<{ category: string; amount: number; transactions: number }>;
  insights: {
    avgDailySpending: number;
    avgDailyIncome: number;
    highestExpenseDay: string;
    mostUsedExpenseCategory: string;
    mostUsedIncomeCategory: string;
    savingsRate: number;
  };
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days

  // Use actual user ID
  const userId = user?._id?.toString();

  useEffect(() => {
    if (userId) {
      loadAnalyticsData();
    }
  }, [timeRange, userId]);

  const loadAnalyticsData = useCallback(async () => {
    if (!userId) {
      console.log('No userId available, skipping analytics data load');
      return;
    }

    try {
      setIsLoading(true);

      // Load transactions and categories
      const [transactionsResponse, categoriesResponse] = await Promise.all([
        fetch(`/api/transactions?userId=${userId}&limit=1000`),
        fetch(`/api/categories?userId=${userId}`)
      ]);

      if (transactionsResponse.ok && categoriesResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setTransactions(transactionsData.data || []);
        setCategories(categoriesData.data || []);

        // Process analytics data
        processAnalyticsData(transactionsData.data || [], categoriesData.data || []);
      } else {
        console.error('Failed to load analytics data');
        toast.error('Failed to load analytics data');
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  }, [userId, timeRange]);

  const processAnalyticsData = (transactions: TransactionWithCategory[], categories: Category[]) => {
    // Filter transactions by time range
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));

    const filteredTransactions = transactions.filter(t =>
      new Date(t.date) >= cutoffDate
    );

    // Category breakdown for expenses
    const expensesByCategory = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const categoryName = t.category?.name || 'Other';
        acc[categoryName] = (acc[categoryName] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const expenseCategoryBreakdown = Object.entries(expensesByCategory).map(([name, value]) => {
      const category = categories.find(c => c.name === name);
      return {
        name,
        value,
        color: category?.color || '#FF6B6B' // Red tones for expenses
      };
    });

    // Category breakdown for income
    const incomeByCategory = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => {
        const categoryName = t.category?.name || 'Other';
        acc[categoryName] = (acc[categoryName] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const incomeCategoryBreakdown = Object.entries(incomeByCategory).map(([name, value]) => {
      const category = categories.find(c => c.name === name);
      return {
        name,
        value,
        color: category?.color || '#4ECDC4' // Green tones for income
      };
    });

    // Monthly trend (last 6 months)
    const monthlyData: Record<string, { income: number; expenses: number }> = {};
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[monthKey] = { income: 0, expenses: 0 };
    }

    filteredTransactions.forEach(t => {
      const monthKey = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthlyData[monthKey]) {
        if (t.type === 'income') {
          monthlyData[monthKey].income += t.amount;
        } else {
          monthlyData[monthKey].expenses += t.amount;
        }
      }
    });

    const monthlyTrend = Object.entries(monthlyData).map(([name, data]) => ({
      name,
      income: data.income,
      expenses: data.expenses,
      value: data.income - data.expenses
    }));

    // Separate monthly data for individual charts
    const monthlyIncome = Object.entries(monthlyData).map(([name, data]) => ({
      name,
      value: data.income
    }));

    const monthlyExpenses = Object.entries(monthlyData).map(([name, data]) => ({
      name,
      value: data.expenses
    }));

    // Top expense categories
    const topExpenseCategories = Object.entries(expensesByCategory)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({
        category,
        amount,
        transactions: filteredTransactions.filter(t =>
          t.category?.name === category && t.type === 'expense'
        ).length
      }));

    // Top income categories
    const topIncomeCategories = Object.entries(incomeByCategory)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({
        category,
        amount,
        transactions: filteredTransactions.filter(t =>
          t.category?.name === category && t.type === 'income'
        ).length
      }));

    // Insights
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const avgDailySpending = totalExpenses / parseInt(timeRange);
    const avgDailyIncome = totalIncome / parseInt(timeRange);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    const analyticsResult = {
      expenseCategoryBreakdown,
      incomeCategoryBreakdown,
      monthlyTrend,
      monthlyIncome,
      monthlyExpenses,
      topExpenseCategories,
      topIncomeCategories,
      insights: {
        avgDailySpending,
        avgDailyIncome,
        highestExpenseDay: 'Monday', // Mock data
        mostUsedExpenseCategory: topExpenseCategories[0]?.category || 'N/A',
        mostUsedIncomeCategory: topIncomeCategories[0]?.category || 'N/A',
        savingsRate
      }
    };

    setAnalyticsData(analyticsResult);
  };

  const formatCurrencyValue = (amount: number) => {
    return formatCurrency(amount, 'INR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  if (isLoading || !userId) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              {!userId ? 'Authenticating...' : 'Loading analytics data...'}
            </p>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
            <p className="text-gray-600 dark:text-gray-300">Insights into your spending patterns and financial health</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Insights */}
        {analyticsData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatsCard
              title="Avg Daily Income"
              value={analyticsData.insights.avgDailyIncome}
              icon={IndianRupee}
            />
            <StatsCard
              title="Avg Daily Spending"
              value={analyticsData.insights.avgDailySpending}
              icon={IndianRupee}
            />
            <StatsCard
              title="Savings Rate"
              value={`${analyticsData.insights.savingsRate.toFixed(1)}%`}
              icon={Target}
              trend={{ value: 5, isPositive: analyticsData.insights.savingsRate > 0 }}
              formatAsCurrency={false}
            />
            <StatsCard
              title="Top Expense Category"
              value={analyticsData.insights.mostUsedExpenseCategory}
              icon={PieChart}
              formatAsCurrency={false}
            />
            <StatsCard
              title="Top Income Category"
              value={analyticsData.insights.mostUsedIncomeCategory}
              icon={BarChart3}
              formatAsCurrency={false}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              No data available for analytics
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Add some transactions to see your financial insights
            </p>
          </div>
        )}

        {/* Charts */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="income">Income Analysis</TabsTrigger>
            <TabsTrigger value="expenses">Expense Analysis</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analyticsData && (
                <>
                  <ExpenseChart
                    data={analyticsData.expenseCategoryBreakdown}
                    type="pie"
                    title="Expenses by Category"
                    height={350}
                  />
                  <ExpenseChart
                    data={analyticsData.incomeCategoryBreakdown}
                    type="pie"
                    title="Income by Category"
                    height={350}
                  />
                </>
              )}
            </div>
            <div className="grid grid-cols-1 gap-6">
              {analyticsData && (
                <ExpenseChart
                  data={analyticsData.monthlyTrend}
                  type="bar"
                  title="Monthly Income vs Expenses Comparison"
                  height={400}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="income" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analyticsData && (
                <>
                  <ExpenseChart
                    data={analyticsData.incomeCategoryBreakdown}
                    type="bar"
                    title="Income by Category"
                    height={400}
                  />
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Income Sources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analyticsData.topIncomeCategories.map((item, index) => (
                          <div key={item.category} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{item.category}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{item.transactions} transactions</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-green-600">{formatCurrencyValue(item.amount)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
            <div className="grid grid-cols-1 gap-6">
              {analyticsData && (
                <ExpenseChart
                  data={analyticsData.monthlyIncome}
                  type="line"
                  title="Monthly Income Trend"
                  height={400}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analyticsData && (
                <>
                  <ExpenseChart
                    data={analyticsData.expenseCategoryBreakdown}
                    type="bar"
                    title="Spending by Category"
                    height={400}
                  />
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Spending Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analyticsData.topExpenseCategories.map((item, index) => (
                          <div key={item.category} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{item.category}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{item.transactions} transactions</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-red-600">{formatCurrencyValue(item.amount)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
            <div className="grid grid-cols-1 gap-6">
              {analyticsData && (
                <ExpenseChart
                  data={analyticsData.monthlyExpenses}
                  type="line"
                  title="Monthly Expense Trend"
                  height={400}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {analyticsData && (
              <ExpenseChart
                data={analyticsData.monthlyTrend}
                type="line"
                title="Financial Trend Over Time"
                height={400}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
