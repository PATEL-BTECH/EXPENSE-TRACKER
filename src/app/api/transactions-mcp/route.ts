import { NextRequest, NextResponse } from 'next/server';
import { MCPDatabaseService } from '@/lib/mcp-database-service';
import { ApiResponse } from '@/types';

const mcpDbService = MCPDatabaseService.getInstance();

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

    // Use MCP database service to get transactions
    const transactions = await mcpDbService.getTransactionsByUser(userId, limit, skip);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: transactions,
      message: `Found ${transactions.length} transactions using MCP MongoDB tools`
    });
  } catch (error) {
    console.error('Error fetching transactions via MCP:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch transactions via MCP: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, description, categoryId, type, date, currency } = body;

    if (!userId || !amount || !description || !categoryId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    const now = new Date();
    const transaction = {
      amount: parseFloat(amount),
      description,
      categoryId: { $oid: categoryId },
      userId: { $oid: userId },
      type,
      date: new Date(date),
      currency: currency || 'INR',
      createdAt: now,
      updatedAt: now,
    };

    // Use MCP MongoDB insert-many tool to create transaction
    const result = await (global as any).insert_many_Mongo_DB({
      database: 'expense-tracker',
      collection: 'transactions',
      documents: [transaction]
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { ...transaction, _id: result.insertedIds[0] },
      message: 'Transaction created successfully using MCP MongoDB tools'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction via MCP:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to create transaction via MCP: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}
