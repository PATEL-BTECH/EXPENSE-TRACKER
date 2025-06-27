import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const logFile = join(process.cwd(), 'visitor-logs.json');
    
    if (!existsSync(logFile)) {
      return NextResponse.json({ 
        visitors: [],
        message: 'No visitor data found yet. Start browsing your site to see logs!' 
      });
    }

    const logsData = readFileSync(logFile, 'utf8');
    const visitors = JSON.parse(logsData);

    return NextResponse.json({ 
      visitors,
      count: visitors.length,
      message: 'Visitor data loaded successfully'
    });

  } catch (error) {
    console.error('Error reading visitor logs:', error);
    return NextResponse.json(
      { error: 'Failed to load visitor data' },
      { status: 500 }
    );
  }
}

// Optional: Add a DELETE endpoint to clear logs
export async function DELETE() {
  try {
    const logFile = join(process.cwd(), 'visitor-logs.json');
    
    if (existsSync(logFile)) {
      // Write empty array to clear logs
      const { writeFileSync } = await import('fs');
      writeFileSync(logFile, JSON.stringify([], null, 2));
    }

    return NextResponse.json({ 
      message: 'Visitor logs cleared successfully'
    });

  } catch (error) {
    console.error('Error clearing visitor logs:', error);
    return NextResponse.json(
      { error: 'Failed to clear visitor logs' },
      { status: 500 }
    );
  }
}
