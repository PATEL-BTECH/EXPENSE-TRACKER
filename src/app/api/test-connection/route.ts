import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Test MongoDB connection
    const db = await getDatabase();
    console.log('Database connected successfully');
    
    // Test a simple query
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.length);
    
    return NextResponse.json({ 
      status: 'ok', 
      message: 'Database connection successful',
      collections: collections.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
