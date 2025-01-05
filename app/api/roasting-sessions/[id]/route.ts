import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await prisma.roastingSession.findUnique({
      where: { id: params.id },
      include: {
        bean: true,
      },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Roasting session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error fetching roasting session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch roasting session' },
      { status: 500 }
    )
  }
} 