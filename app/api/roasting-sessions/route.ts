import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { RoastingStatus } from '@/lib/types';

// バリデーションスキーマ
const sessionSchema = z.object({
  date: z.string().datetime(),
  beanName: z.string(),
  inputWeight: z.number(),
  outputWeight: z.number(),
  notes: z.string().optional(),
  beanId: z.string(),
  averageTemp: z.number(),
  averageHumidity: z.number(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // バリデーション
    const validatedData = sessionSchema.parse(body);

    // セッションの作成（未完了状態）
    const session = await prisma.roastingSession.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 未完了セッションの取得
export async function GET(request: Request) {
  try {
    const sessions = await prisma.roastingSession.findMany({
      where: {
        status: 'INCOMPLETE'
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
    console.error('Error fetching incomplete sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 