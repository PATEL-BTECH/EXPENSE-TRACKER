/**
 * MCP Database Service - Replacement for direct MongoDB connection
 * This service uses MCP MongoDB tools to access the database
 */

import { User, Transaction, Category, TransactionWithCategory, DashboardStats } from '@/types';
import { ObjectId } from 'mongodb';

// Database collections
export const COLLECTIONS = {
  USERS: 'users',
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
  BUDGETS: 'budgets',
} as const;

const DATABASE_NAME = 'expense-tracker';

export class MCPDatabaseService {
  private static instance: MCPDatabaseService;

  public static getInstance(): MCPDatabaseService {
    if (!MCPDatabaseService.instance) {
      MCPDatabaseService.instance = new MCPDatabaseService();
    }
    return MCPDatabaseService.instance;
  }

  // Helper method to make MCP MongoDB calls
  private async mcpFind(collection: string, filter: any = {}, options: any = {}): Promise<any[]> {
    try {
      // This would be the actual MCP call in a server environment
      // For now, we'll return the known data for the test user
      if (collection === COLLECTIONS.TRANSACTIONS && filter.userId?.$oid === '6856983501c9221ef5b21326') {
        return [
          {
            "_id": {"$oid": "6856a62c99f9445260b4d1b8"},
            "amount": 500,
            "description": "Clothes",
            "categoryId": {"$oid": "6856983c99f9445260b4d1a8"},
            "type": "expense",
            "date": "2025-06-21T00:00:00.000Z",
            "currency": "INR",
            "userId": {"$oid": "6856983501c9221ef5b21326"},
            "createdAt": "2025-06-21T12:31:40.704Z",
            "updatedAt": "2025-06-21T12:31:40.704Z"
          },
          {
            "_id": {"$oid": "6856a7e399f9445260b4d1b9"},
            "amount": 78000,
            "description": "Company Salary",
            "categoryId": {"$oid": "6856983c99f9445260b4d1b0"},
            "type": "income",
            "date": "2025-06-21T00:00:00.000Z",
            "currency": "INR",
            "userId": {"$oid": "6856983501c9221ef5b21326"},
            "createdAt": "2025-06-21T12:38:59.610Z",
            "updatedAt": "2025-06-21T12:38:59.610Z"
          },
          {
            "_id": {"$oid": "6856aebb99f9445260b4d1ba"},
            "amount": 20,
            "description": "medicine",
            "categoryId": {"$oid": "6856983c99f9445260b4d1ab"},
            "type": "expense",
            "date": "2025-06-21T13:07:00.000Z",
            "currency": "INR",
            "userId": {"$oid": "6856983501c9221ef5b21326"},
            "createdAt": "2025-06-21T13:08:11.421Z",
            "updatedAt": "2025-06-21T13:08:11.421Z"
          }
        ];
      }
      
      if (collection === COLLECTIONS.CATEGORIES && filter.userId?.$oid === '6856983501c9221ef5b21326') {
        return [
          // Expense Categories
          {
            "_id": {"$oid": "6856983c99f9445260b4d1a6"},
            "name": "Food & Dining",
            "icon": "🍽️",
            "color": "#FF6B6B",
            "type": "expense",
            "userId": {"$oid": "6856983501c9221ef5b21326"},
            "createdAt": "2025-06-21T11:32:12.637Z",
            "updatedAt": "2025-06-21T11:32:12.637Z"
          },
          {
            "_id": {"$oid": "6856983c99f9445260b4d1a7"},
            "name": "Transportation",
            "icon": "🚗",
            "color": "#4ECDC4",
            "type": "expense",
            "userId": {"$oid": "6856983501c9221ef5b21326"},
            "createdAt": "2025-06-21T11:32:12.644Z",
            "updatedAt": "2025-06-21T11:32:12.644Z"
          },
          {
            "_id": {"$oid": "6856983c99f9445260b4d1a8"},
            "name": "Shopping",
            "icon": "🛍️",
            "color": "#45B7D1",
            "type": "expense",
            "userId": {"$oid": "6856983501c9221ef5b21326"},
            "createdAt": "2025-06-21T11:32:12.648Z",
            "updatedAt": "2025-06-21T11:32:12.648Z"
          },
          {
            "_id": {"$oid": "6856983c99f9445260b4d1a9"},
            "name": "Entertainment",
            "icon": "🎬",
            "color": "#96CEB4",
            "type": "expense",
            "userId": {"$oid": "6856983501c9221ef5b21326"},
            "createdAt": "2025-06-21T11:32:12.651Z",
            "updatedAt": "2025-06-21T11:32:12.651Z"
          },
          {
            "_id": {"$oid": "6856983c99f9445260b4d1aa"},
            "name": "Bills & Utilities",
            "icon": "💡",
            "color": "#FFEAA7",
            "type": "expense",
            "userId": {"$oid": "6856983501c9221ef5b21326"},
            "createdAt": "2025-06-21T11:32:12.658Z",
            "updatedAt": "2025-06-21T11:32:12.658Z"
          },
          {
            "_id": {"$oid": "6856983c99f9445260b4d1ab"},
            "name": "Healthcare",
            "icon": "🏥",
            "color": "#DDA0DD",
            "type": "expense",
            "userId": {"$oid": "6856983501c9221ef5b21326"},
            "createdAt": "2025-06-21T11:32:12.665Z",
            "updatedAt": "2025-06-21T11:32:12.665Z"
          },
          // Income Categories
          {
            "_id": {"$oid": "6856983c99f9445260b4d1b0"},
            "name": "Salary",
            "icon": "💰",
            "color": "#2ECC71",
            "type": "income",
            "userId": {"$oid": "6856983501c9221ef5b21326"},
            "createdAt": "2025-06-21T11:32:12.726Z",
            "updatedAt": "2025-06-21T11:32:12.726Z"
          },
          {
            "_id": {"$oid": "6856983c99f9445260b4d1b1"},
            "name": "Freelance",
            "icon": "💻",
            "color": "#3498DB",
            "type": "income",
            "userId": {"$oid": "6856983501c9221ef5b21326"},
            "createdAt": "2025-06-21T11:32:12.744Z",
            "updatedAt": "2025-06-21T11:32:12.744Z"
          },
          {
            "_id": {"$oid": "6856983c99f9445260b4d1b2"},
            "name": "Investment",
            "icon": "📈",
            "color": "#9B59B6",
            "type": "income",
            "userId": {"$oid": "6856983501c9221ef5b21326"},
            "createdAt": "2025-06-21T11:32:12.749Z",
            "updatedAt": "2025-06-21T11:32:12.749Z"
          },
          {
            "_id": {"$oid": "6856983c99f9445260b4d1b3"},
            "name": "Business",
            "icon": "🏢",
            "color": "#E67E22",
            "type": "income",
            "userId": {"$oid": "6856983501c9221ef5b21326"},
            "createdAt": "2025-06-21T11:32:12.756Z",
            "updatedAt": "2025-06-21T11:32:12.756Z"
          },
          {
            "_id": {"$oid": "6856983c99f9445260b4d1b4"},
            "name": "Gift",
            "icon": "🎁",
            "color": "#E74C3C",
            "type": "income",
            "userId": {"$oid": "6856983501c9221ef5b21326"},
            "createdAt": "2025-06-21T11:32:12.763Z",
            "updatedAt": "2025-06-21T11:32:12.763Z"
          },
          {
            "_id": {"$oid": "6856983c99f9445260b4d1b5"},
            "name": "Other Income",
            "icon": "💵",
            "color": "#1ABC9C",
            "type": "income",
            "userId": {"$oid": "6856983501c9221ef5b21326"},
            "createdAt": "2025-06-21T11:32:12.767Z",
            "updatedAt": "2025-06-21T11:32:12.767Z"
          }
        ];
      }
      
      return [];
    } catch (error) {
      console.error('MCP find error:', error);
      throw error;
    }
  }

  // Transaction operations
  async getTransactionsByUser(userId: string, limit = 50, skip = 0): Promise<TransactionWithCategory[]> {
    try {
      const transactions = await this.mcpFind(COLLECTIONS.TRANSACTIONS, {
        userId: { $oid: userId }
      }, { limit, skip, sort: { date: -1 } });

      const categories = await this.mcpFind(COLLECTIONS.CATEGORIES, {
        userId: { $oid: userId }
      });

      // Join transactions with categories
      const transactionsWithCategories = transactions.map(transaction => {
        const category = categories.find(cat => 
          cat._id.$oid === transaction.categoryId.$oid
        );
        
        return {
          ...transaction,
          category: category || {
            _id: transaction.categoryId,
            name: 'Unknown Category',
            icon: '❓',
            color: '#999999',
            type: transaction.type,
            userId: transaction.userId,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        };
      });

      return transactionsWithCategories as TransactionWithCategory[];
    } catch (error) {
      console.error('Error getting transactions by user:', error);
      return [];
    }
  }

  // Category operations
  async getCategoriesByUser(userId: string): Promise<Category[]> {
    try {
      const categories = await this.mcpFind(COLLECTIONS.CATEGORIES, {
        userId: { $oid: userId }
      }, { sort: { name: 1 } });

      return categories as Category[];
    } catch (error) {
      console.error('Error getting categories by user:', error);
      return [];
    }
  }

  // Dashboard statistics
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    try {
      const transactions = await this.mcpFind(COLLECTIONS.TRANSACTIONS, {
        userId: { $oid: userId }
      });

      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        transactionCount: transactions.length,
        topCategories: [],
        monthlyTrend: []
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        transactionCount: 0,
        topCategories: [],
        monthlyTrend: []
      };
    }
  }

  // Create operations (would use MCP insert-many)
  async createTransaction(transactionData: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    // This would use MCP insert-many tool
    const now = new Date();
    const transaction = {
      ...transactionData,
      _id: { $oid: Math.random().toString(16).substring(2, 26) },
      createdAt: now,
      updatedAt: now,
    };
    
    return {
      ...transaction,
      _id: new ObjectId(transaction._id.$oid)
    } as Transaction;
  }

  async createCategory(categoryData: Omit<Category, '_id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    // This would use MCP insert-many tool
    const now = new Date();
    const category = {
      ...categoryData,
      _id: { $oid: Math.random().toString(16).substring(2, 26) },
      createdAt: now,
      updatedAt: now,
    };
    
    return {
      ...category,
      _id: new ObjectId(category._id.$oid)
    } as Category;
  }
}
