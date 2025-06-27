import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db-service';
import { CategoryFormData, ApiResponse } from '@/types';
import { ObjectId } from 'mongodb';

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

    const categories = await dbService.getCategoriesByUser(userId);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch categories'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CategoryFormData & { userId: string } = await request.json();
    
    if (!body.userId || !body.name || !body.type) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    const categoryData = {
      ...body,
      userId: new ObjectId(body.userId)
    };
    const category = await dbService.createCategory(categoryData);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: category,
      message: 'Category created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to create category'
    }, { status: 500 });
  }
}
