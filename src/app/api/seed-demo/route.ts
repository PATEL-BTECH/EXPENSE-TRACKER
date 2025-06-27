import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db-service';
import { ALL_DEFAULT_CATEGORIES } from '@/lib/default-categories';
import { ApiResponse } from '@/types';
import { ObjectId } from 'mongodb';

const dbService = DatabaseService.getInstance();

// Demo user ID (consistent with AuthContext)
const DEMO_USER_ID = '507f1f77bcf86cd799439011';

// Demo transactions data
const DEMO_TRANSACTIONS = [
  {
    amount: 1200,
    description: 'Monthly Salary',
    type: 'income' as const,
    date: new Date('2024-12-01'),
    currency: 'INR'
  },
  {
    amount: 350,
    description: 'Grocery Shopping',
    type: 'expense' as const,
    date: new Date('2024-12-02'),
    currency: 'INR'
  },
  {
    amount: 150,
    description: 'Fuel',
    type: 'expense' as const,
    date: new Date('2024-12-03'),
    currency: 'INR'
  },
  {
    amount: 80,
    description: 'Movie Tickets',
    type: 'expense' as const,
    date: new Date('2024-12-04'),
    currency: 'INR'
  },
  {
    amount: 500,
    description: 'Freelance Project',
    type: 'income' as const,
    date: new Date('2024-12-05'),
    currency: 'INR'
  },
  {
    amount: 200,
    description: 'Electricity Bill',
    type: 'expense' as const,
    date: new Date('2024-12-06'),
    currency: 'INR'
  },
  {
    amount: 120,
    description: 'Restaurant Dinner',
    type: 'expense' as const,
    date: new Date('2024-12-07'),
    currency: 'INR'
  },
  {
    amount: 300,
    description: 'Online Course',
    type: 'expense' as const,
    date: new Date('2024-12-08'),
    currency: 'INR'
  }
];

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId || userId !== DEMO_USER_ID) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid demo user ID'
      }, { status: 400 });
    }

    // Check if demo data already exists
    const existingCategories = await dbService.getCategoriesByUser(userId);
    const existingTransactions = await dbService.getTransactionsByUser(userId, 10);
    
    if (existingCategories.length > 0 && existingTransactions.length > 0) {
      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Demo data already exists',
        data: {
          categories: existingCategories.length,
          transactions: existingTransactions.length
        }
      });
    }

    // Create categories if they don't exist
    let categories = existingCategories;
    if (categories.length === 0) {
      const createdCategories = [];
      for (const categoryData of ALL_DEFAULT_CATEGORIES) {
        const category = await dbService.createCategory({
          ...categoryData,
          userId: new ObjectId(userId)
        });
        createdCategories.push(category);
      }
      categories = createdCategories;
    }

    // Create demo transactions
    const createdTransactions = [];
    if (existingTransactions.length === 0) {
      for (const transactionData of DEMO_TRANSACTIONS) {
        // Find appropriate category for the transaction
        const categoryName = getCategoryForTransaction(transactionData.description, transactionData.type);
        const category = categories.find(cat => 
          cat.name.toLowerCase().includes(categoryName.toLowerCase()) && 
          cat.type === transactionData.type
        ) || categories.find(cat => cat.type === transactionData.type);

        if (category) {
          const transaction = await dbService.createTransaction({
            ...transactionData,
            categoryId: category._id!,
            userId: new ObjectId(userId)
          });
          createdTransactions.push(transaction);
        }
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `Demo data seeded successfully`,
      data: {
        categories: categories.length,
        transactions: createdTransactions.length
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error seeding demo data:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to seed demo data'
    }, { status: 500 });
  }
}

// Helper function to match transactions to categories
function getCategoryForTransaction(description: string, type: 'income' | 'expense'): string {
  const desc = description.toLowerCase();
  
  if (type === 'income') {
    if (desc.includes('salary')) return 'salary';
    if (desc.includes('freelance')) return 'freelance';
    return 'other income';
  }
  
  // Expense categories
  if (desc.includes('grocery') || desc.includes('food')) return 'food';
  if (desc.includes('fuel') || desc.includes('transport')) return 'transportation';
  if (desc.includes('movie') || desc.includes('entertainment')) return 'entertainment';
  if (desc.includes('bill') || desc.includes('electricity')) return 'bills';
  if (desc.includes('restaurant') || desc.includes('dinner')) return 'food';
  if (desc.includes('course') || desc.includes('education')) return 'education';
  
  return 'other';
}
