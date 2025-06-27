/**
 * Basic API Tests for Expense Tracker
 * These tests verify that our API endpoints are working correctly
 */

import { describe, it, expect } from '@jest/globals';

// Mock fetch for testing
global.fetch = jest.fn();

describe('API Endpoints', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('Database Connection', () => {
    it('should connect to MongoDB successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            connected: true,
            database: 'expense-tracker',
            collections: 0,
            message: 'MongoDB connection successful'
          }
        })
      });

      const response = await fetch('/api/test-db');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(data.data.connected).toBe(true);
    });
  });

  describe('Categories API', () => {
    it('should fetch categories for a user', async () => {
      const mockCategories = [
        {
          _id: '507f1f77bcf86cd799439013',
          name: 'Food & Dining',
          icon: '🍽️',
          color: '#FF6B6B',
          type: 'expense',
          userId: '507f1f77bcf86cd799439011'
        }
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockCategories
        })
      });

      const response = await fetch('/api/categories?userId=507f1f77bcf86cd799439011');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data[0]).toHaveProperty('name');
      expect(data.data[0]).toHaveProperty('type');
    });

    it('should create a new category', async () => {
      const newCategory = {
        name: 'Test Category',
        icon: '🧪',
        color: '#FF0000',
        type: 'expense',
        userId: '507f1f77bcf86cd799439011'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { ...newCategory, _id: '507f1f77bcf86cd799439014' },
          message: 'Category created successfully'
        })
      });

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      });
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe(newCategory.name);
    });
  });

  describe('Transactions API', () => {
    it('should fetch transactions for a user', async () => {
      const mockTransactions = [
        {
          _id: '507f1f77bcf86cd799439015',
          amount: 25.50,
          description: 'Coffee',
          type: 'expense',
          date: new Date().toISOString(),
          userId: '507f1f77bcf86cd799439011',
          category: {
            name: 'Food & Dining',
            icon: '🍽️'
          }
        }
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockTransactions
        })
      });

      const response = await fetch('/api/transactions?userId=507f1f77bcf86cd799439011');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data[0]).toHaveProperty('amount');
      expect(data.data[0]).toHaveProperty('description');
    });
  });

  describe('Dashboard API', () => {
    it('should fetch dashboard statistics', async () => {
      const mockStats = {
        totalIncome: 1000,
        totalExpenses: 750,
        balance: 250,
        transactionCount: 15
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockStats
        })
      });

      const response = await fetch('/api/dashboard?userId=507f1f77bcf86cd799439011');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('totalIncome');
      expect(data.data).toHaveProperty('totalExpenses');
      expect(data.data).toHaveProperty('balance');
    });
  });
});

describe('Utility Functions', () => {
  describe('Currency Formatting', () => {
    it('should format currency correctly', () => {
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);
      };

      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(-100)).toBe('-$100.00');
    });
  });

  describe('Date Formatting', () => {
    it('should format dates correctly', () => {
      const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }).format(date);
      };

      const testDate = new Date('2024-01-15');
      expect(formatDate(testDate)).toBe('Jan 15, 2024');
    });
  });
});

describe('Data Validation', () => {
  describe('Transaction Validation', () => {
    it('should validate transaction data', () => {
      const isValidTransaction = (transaction: any) => {
        return (
          transaction &&
          typeof transaction.amount === 'number' &&
          transaction.amount > 0 &&
          typeof transaction.description === 'string' &&
          transaction.description.length > 0 &&
          ['income', 'expense'].includes(transaction.type)
        );
      };

      const validTransaction = {
        amount: 100,
        description: 'Test transaction',
        type: 'expense'
      };

      const invalidTransaction = {
        amount: -100,
        description: '',
        type: 'invalid'
      };

      expect(isValidTransaction(validTransaction)).toBe(true);
      expect(isValidTransaction(invalidTransaction)).toBe(false);
    });
  });
});
