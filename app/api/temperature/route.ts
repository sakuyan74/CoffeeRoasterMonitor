import { NextResponse } from 'next/server';
import { generateMockData } from '@/lib/mockData';

// import sqlite3 from 'sqlite3';
// import { open } from 'sqlite';

// let db: any;
// (async () => {
//   db = await open({
//     filename: './coffee_roaster.db',
//     driver: sqlite3.Database
//   });
// })();

export async function GET() {
  try {
    // if (!db) {
    //   throw new Error('Database is not initialized');
    // }
    // const temperatures = await db.all('SELECT * FROM temperatures ORDER BY timestamp DESC LIMIT 100');
    // return NextResponse.json(temperatures);
    const mockData = generateMockData();
    return NextResponse.json(mockData);
  } catch (error) {
    console.error('データ生成エラー:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

