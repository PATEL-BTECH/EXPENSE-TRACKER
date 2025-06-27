import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: {
    currency: string;
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
}

export interface Category {
  _id?: ObjectId;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  _id?: ObjectId;
  amount: number;
  description: string;
  categoryId: ObjectId;
  userId: ObjectId;
  type: 'income' | 'expense';
  date: Date;
  currency: string;
  tags?: string[];
  receipt?: {
    filename: string;
    url: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  _id?: ObjectId;
  name: string;
  amount: number;
  spent: number;
  categoryId?: ObjectId;
  userId: ObjectId;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionWithCategory extends Transaction {
  category: Category;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  topCategories: Array<{
    category: Category;
    amount: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type TransactionFormData = Omit<Transaction, '_id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type CategoryFormData = Omit<Category, '_id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type BudgetFormData = Omit<Budget, '_id' | 'userId' | 'spent' | 'createdAt' | 'updatedAt'>;
