import { NextRequest, NextResponse } from 'next/server';
import { MCPDatabaseService } from '@/lib/mcp-database-service';
import { ApiResponse } from '@/types';

const mcpDbService = MCPDatabaseService.getInstance();

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

    // Use MCP database service to get dashboard stats
    const stats = await mcpDbService.getDashboardStats(userId);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: stats,
      message: 'Dashboard stats retrieved using MCP MongoDB tools'
    });
  } catch (error) {
    console.error('Error fetching dashboard stats via MCP:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch dashboard statistics via MCP'
    }, { status: 500 });
  }
}
