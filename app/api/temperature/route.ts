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
    const mockData = generateMockData();
    return NextResponse.json(mockData);
  } catch (error: any) {
    console.error('データ生成エラー:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' }, 
      { status: 500 }
    );
  }
}

