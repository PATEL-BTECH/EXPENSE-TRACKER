import { ObjectId } from 'mongodb';
import { User, Transaction, Category, TransactionWithCategory, DashboardStats } from '@/types';
import { getDatabase } from '@/lib/mongodb';

// Database collections
export const COLLECTIONS = {
  USERS: 'users',
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
  BUDGETS: 'budgets',
} as const;

export class DatabaseService {
  private static instance: DatabaseService;

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // User operations
  async createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const db = await getDatabase();
      const now = new Date();
      const user: User = {
        ...userData,
        createdAt: now,
        updatedAt: now,
      };

      const result = await db.collection(COLLECTIONS.USERS).insertOne(user);
      return { ...user, _id: result.insertedId };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const db = await getDatabase();
    return await db.collection(COLLECTIONS.USERS).findOne({ email }) as User | null;
  }

  async getUserById(id: string): Promise<User | null> {
    const db = await getDatabase();
    return await db.collection(COLLECTIONS.USERS).findOne({ _id: new ObjectId(id) }) as User | null;
  }

  // Category operations
  async createCategory(categoryData: Omit<Category, '_id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const db = await getDatabase();
    const now = new Date();

    // Ensure userId is ObjectId
    const category: Category = {
      ...categoryData,
      userId: categoryData.userId instanceof ObjectId ? categoryData.userId : new ObjectId(categoryData.userId as string),
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection(COLLECTIONS.CATEGORIES).insertOne(category);
    return { ...category, _id: result.insertedId };
  }

  async getCategoriesByUser(userId: string): Promise<Category[]> {
    const db = await getDatabase();
    return await db.collection(COLLECTIONS.CATEGORIES)
      .find({ userId: new ObjectId(userId) })
      .sort({ name: 1 })
      .toArray() as Category[];
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.collection(COLLECTIONS.CATEGORIES).updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.collection(COLLECTIONS.CATEGORIES).deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Transaction operations
  async createTransaction(transactionData: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const db = await getDatabase();
    const now = new Date();

    // Ensure IDs are ObjectIds
    const transaction: Transaction = {
      ...transactionData,
      userId: transactionData.userId instanceof ObjectId ? transactionData.userId : new ObjectId(transactionData.userId as string),
      categoryId: transactionData.categoryId instanceof ObjectId ? transactionData.categoryId : new ObjectId(transactionData.categoryId as string),
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection(COLLECTIONS.TRANSACTIONS).insertOne(transaction);
    return { ...transaction, _id: result.insertedId };
  }

  async getTransactionsByUser(userId: string, limit = 50, skip = 0): Promise<TransactionWithCategory[]> {
    const db = await getDatabase();
    return await db.collection(COLLECTIONS.TRANSACTIONS).aggregate([
      { $match: { userId: new ObjectId(userId) } },
      { $sort: { date: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: COLLECTIONS.CATEGORIES,
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' }
    ]).toArray() as TransactionWithCategory[];
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.collection(COLLECTIONS.TRANSACTIONS).updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  async deleteTransaction(id: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.collection(COLLECTIONS.TRANSACTIONS).deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Dashboard statistics
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    const db = await getDatabase();
    const userObjectId = new ObjectId(userId);

    // Get ALL transactions for the user (not just current month)
    const transactions = await db.collection(COLLECTIONS.TRANSACTIONS)
      .find({
        userId: userObjectId
      })
      .toArray() as Transaction[];

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
      topCategories: [], // TODO: Implement category aggregation
      monthlyTrend: [], // TODO: Implement monthly trend
    };
  }
}
