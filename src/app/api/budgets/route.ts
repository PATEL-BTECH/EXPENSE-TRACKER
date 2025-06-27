import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db-service';
import { BudgetFormData, ApiResponse } from '@/types';

const dbService = DatabaseService.getInstance();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    // For now, return mock budget data since we haven't implemented budget CRUD in DatabaseService
    const mockBudgets = [
      {
        _id: '507f1f77bcf86cd799439012',
        name: 'Monthly Food Budget',
        amount: 500,
        spent: 320,
        categoryId: '507f1f77bcf86cd799439013',
        userId,
        period: 'monthly',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: '507f1f77bcf86cd799439014',
        name: 'Transportation Budget',
        amount: 200,
        spent: 150,
        categoryId: '507f1f77bcf86cd799439015',
        userId,
        period: 'monthly',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return NextResponse.json<ApiResponse>({
      success: true,
      data: mockBudgets
    });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch budgets'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: BudgetFormData & { userId: string } = await request.json();
    
    if (!body.userId || !body.name || !body.amount) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // For now, return mock created budget
    const mockBudget = {
      _id: '507f1f77bcf86cd799439016',
      ...body,
      spent: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json<ApiResponse>({
      success: true,
      data: mockBudget,
      message: 'Budget created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to create budget'
    }, { status: 500 });
  }
}
