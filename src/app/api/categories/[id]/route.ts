import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db-service';
import { CategoryFormData, ApiResponse } from '@/types';
import { ObjectId } from 'mongodb';

const dbService = DatabaseService.getInstance();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body: CategoryFormData & { userId: string } = await request.json();
    const { id } = await params;
    
    if (!body.userId || !body.name || !body.type) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    const updateData = {
      ...body,
      userId: new ObjectId(body.userId)
    };
    const success = await dbService.updateCategory(id, updateData);

    if (success) {
      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Category updated successfully'
      });
    } else {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Category not found or update failed'
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to update category'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const success = await dbService.deleteCategory(id);

    if (success) {
      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Category deleted successfully'
      });
    } else {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Category not found or delete failed'
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to delete category'
    }, { status: 500 });
  }
}
