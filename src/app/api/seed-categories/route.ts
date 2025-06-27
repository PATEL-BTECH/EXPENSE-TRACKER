import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db-service';
import { ALL_DEFAULT_CATEGORIES } from '@/lib/default-categories';
import { ApiResponse } from '@/types';
import { ObjectId } from 'mongodb';

const dbService = DatabaseService.getInstance();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    // Check if user already has categories
    const existingCategories = await dbService.getCategoriesByUser(userId);

    // Check if we have both income and expense categories
    const hasIncomeCategories = existingCategories.some(cat => cat.type === 'income');
    const hasExpenseCategories = existingCategories.some(cat => cat.type === 'expense');

    if (hasIncomeCategories && hasExpenseCategories && existingCategories.length >= 10) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: existingCategories,
        message: 'Categories already exist for this user'
      });
    }

    // Create missing categories for the user
    const createdCategories = [];
    const allCategories = [...existingCategories];

    for (const categoryData of ALL_DEFAULT_CATEGORIES) {
      // Check if this category already exists
      const exists = existingCategories.some(cat =>
        cat.name === categoryData.name && cat.type === categoryData.type
      );

      if (!exists) {
        const category = await dbService.createCategory({
          ...categoryData,
          userId: new ObjectId(userId)
        });
        createdCategories.push(category);
        allCategories.push(category);
      }
    }

    const message = createdCategories.length > 0
      ? `Created ${createdCategories.length} new categories`
      : 'All categories already exist';

    return NextResponse.json<ApiResponse>({
      success: true,
      data: allCategories,
      message: message
    }, { status: 201 });
  } catch (error) {
    console.error('Error seeding categories:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to seed categories'
    }, { status: 500 });
  }
}
