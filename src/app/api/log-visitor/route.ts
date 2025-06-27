import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const logData = await request.json();
    
    const logFile = join(process.cwd(), 'visitor-logs.json');
    let logs: any[] = [];

    // Read existing logs
    if (existsSync(logFile)) {
      try {
        const existingLogs = readFileSync(logFile, 'utf8');
        logs = JSON.parse(existingLogs);
      } catch (error) {
        console.error('Error reading log file:', error);
        logs = [];
      }
    }

    // Add new log entry
    logs.push(logData);

    // Keep only last 1000 entries to prevent file from getting too large
    if (logs.length > 1000) {
      logs = logs.slice(-1000);
    }

    // Write back to file
    writeFileSync(logFile, JSON.stringify(logs, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging visitor:', error);
    return NextResponse.json({ error: 'Failed to log visitor' }, { status: 500 });
  }
}
