import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db-service';
import { TransactionFormData, ApiResponse } from '@/types';
import { ObjectId } from 'mongodb';

const dbService = DatabaseService.getInstance();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    if (!userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    const transactions = await dbService.getTransactionsByUser(userId, limit, skip);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch transactions'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TransactionFormData & { userId: string } = await request.json();

    if (!body.userId || !body.amount || !body.description || !body.categoryId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    const transactionData = {
      ...body,
      userId: new ObjectId(body.userId),
      categoryId: new ObjectId(body.categoryId)
    };
    const transaction = await dbService.createTransaction(transactionData);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: transaction,
      message: 'Transaction created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to create transaction'
    }, { status: 500 });
  }
}
