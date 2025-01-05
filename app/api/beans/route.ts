import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// 豆一覧の取得
export async function GET() {
  try {
    const beans = await prisma.bean.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(beans);
  } catch (error) {
    console.error('Error fetching beans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch beans' },
      { status: 500 }
    );
  }
}

// 新規豆の登録
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const bean = await prisma.bean.create({
      data: {
        name: data.name,
        country: data.country,
        region: data.region,
        farm: data.farm,
        variety: data.variety,
        elevation: data.elevation,
        process: data.process,
        cropYear: data.cropYear,
        grade: data.grade,
        description: data.description,
        tags: data.tags,
      },
    });

    return NextResponse.json(bean);
  } catch (error) {
    console.error('Error creating bean:', error);
    return NextResponse.json(
      { error: 'Failed to create bean' },
      { status: 500 }
    );
  }
}

// 豆の更新
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    const bean = await prisma.bean.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(bean);
  } catch (error) {
    console.error('Error updating bean:', error);
    return NextResponse.json(
      { error: 'Failed to update bean' },
      { status: 500 }
    );
  }
}

// 豆の削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Bean ID is required' },
        { status: 400 }
      );
    }

    await prisma.bean.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bean:', error);
    return NextResponse.json(
      { error: 'Failed to delete bean' },
      { status: 500 }
    );
  }
} 