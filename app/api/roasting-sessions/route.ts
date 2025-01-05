import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const tempMin = parseFloat(searchParams.get('tempMin') || '0');
    const tempMax = parseFloat(searchParams.get('tempMax') || '100');
    const humidityMin = parseFloat(searchParams.get('humidityMin') || '0');
    const humidityMax = parseFloat(searchParams.get('humidityMax') || '100');

    const skip = (page - 1) * limit;

    // 検索条件を構築
    const where = {
      OR: [
        { beanName: { contains: search } },
        { notes: { contains: search } },
      ],
      AND: [
        {
          averageTemp: {
            gte: tempMin,
            lte: tempMax,
          },
        },
        {
          averageHumidity: {
            gte: humidityMin,
            lte: humidityMax,
          },
        },
      ],
    };

    // 総件数を取得
    const total = await prisma.roastingSession.count({ where });

    // セッションを取得
    const sessions = await prisma.roastingSession.findMany({
      where,
      include: {
        timePoints: true,
        bean: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      sessions,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
} 