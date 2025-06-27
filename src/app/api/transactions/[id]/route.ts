import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db-service';
import { TransactionFormData, ApiResponse } from '@/types';
import { ObjectId } from 'mongodb';

const dbService = DatabaseService.getInstance();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body: TransactionFormData & { userId: string } = await request.json();
    const { id } = await params;
    
    if (!body.userId || !body.amount || !body.description || !body.categoryId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    const updateData = {
      ...body,
      userId: new ObjectId(body.userId),
      categoryId: new ObjectId(body.categoryId)
    };
    const success = await dbService.updateTransaction(id, updateData);

    if (success) {
      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Transaction updated successfully'
      });
    } else {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Transaction not found or update failed'
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to update transaction'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const success = await dbService.deleteTransaction(id);

    if (success) {
      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Transaction deleted successfully'
      });
    } else {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Transaction not found or delete failed'
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to delete transaction'
    }, { status: 500 });
  }
}
