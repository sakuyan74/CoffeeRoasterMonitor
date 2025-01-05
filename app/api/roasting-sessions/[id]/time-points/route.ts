import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// バリデーションスキーマ
const timePointSchema = z.object({
  timestamp: z.string().datetime(),
  temperature: z.number().min(0).max(300),
  isFirstCrack: z.boolean(),
  isSecondCrack: z.boolean(),
  ambientTemperature: z.number().min(-10).max(50),
  humidity: z.number().min(0).max(100),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const body = await request.json();

    // バリデーション
    const validatedData = timePointSchema.parse(body);

    // セッションの存在確認
    const session = await prisma.roastingSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // タイムポイントの作成
    const timePoint = await prisma.roastingTimePoint.create({
      data: {
        ...validatedData,
        timestamp: new Date(validatedData.timestamp),
        sessionId,
      },
    });

    return NextResponse.json(timePoint, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating time point:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 