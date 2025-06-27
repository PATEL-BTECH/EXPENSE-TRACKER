import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db-service';
import { ApiResponse } from '@/types';

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

    const stats = await dbService.getDashboardStats(userId);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch dashboard statistics'
    }, { status: 500 });
  }
}
