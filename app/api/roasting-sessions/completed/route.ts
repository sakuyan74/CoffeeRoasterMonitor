import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 完了済みセッションの取得
export async function GET(request: Request) {
  try {
    const sessions = await prisma.roastingSession.findMany({
      where: {
        status: 'COMPLETED'
      },
      include: {
        timePoints: true,
        bean: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error fetching completed sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 