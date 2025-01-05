import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// 豆の取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bean = await prisma.bean.findUnique({
      where: { id: params.id },
    });

    if (!bean) {
      return NextResponse.json(
        { error: 'Bean not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(bean);
  } catch (error) {
    console.error('Error fetching bean:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bean' },
      { status: 500 }
    );
  }
}

// 豆の更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const bean = await prisma.bean.update({
      where: { id: params.id },
      data,
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.bean.delete({
      where: { id: params.id },
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