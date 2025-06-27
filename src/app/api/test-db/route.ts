import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ApiResponse } from '@/types';

export async function GET() {
  try {
    const db = await getDatabase();
    
    // Test the connection by getting database stats
    const stats = await db.stats();
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        connected: true,
        database: db.databaseName,
        collections: stats.collections || 0,
        message: 'MongoDB connection successful'
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to connect to MongoDB',
      data: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}
