import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, CategoryFormData } from '@/types';

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

    // Use MCP MongoDB find tool directly
    const categories = await (global as any).find_Mongo_DB({
      database: 'expense-tracker',
      collection: 'categories',
      filter: { userId: { $oid: userId } },
      sort: { name: 1 }
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: categories,
      message: `Found ${categories.length} categories using MCP MongoDB tools`
    });
  } catch (error) {
    console.error('Error fetching categories via MCP:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch categories via MCP'
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

    // Create category using MCP MongoDB insert-many tool
    const now = new Date();
    const category = {
      name: body.name,
      icon: body.icon,
      color: body.color,
      type: body.type,
      userId: { $oid: body.userId },
      createdAt: now,
      updatedAt: now,
    };

    const result = await (global as any).insert_many_Mongo_DB({
      database: 'expense-tracker',
      collection: 'categories',
      documents: [category]
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { ...category, _id: result.insertedIds[0] },
      message: 'Category created successfully using MCP MongoDB tools'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category via MCP:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to create category via MCP: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}
