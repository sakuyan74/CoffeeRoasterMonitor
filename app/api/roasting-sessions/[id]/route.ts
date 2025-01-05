import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const updateSessionSchema = z.object({
  beanId: z.string(),
  inputWeight: z.number(),
  outputWeight: z.number(),
  status: z.enum(['INCOMPLETE', 'COMPLETED']),
  notes: z.string().optional(),
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await prisma.roastingSession.findUnique({
      where: { id: params.id },
      include: {
        timePoints: true,
        bean: true,
      },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateSessionSchema.parse(body)

    const session = await prisma.roastingSession.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        timePoints: true,
        bean: true,
      },
    })

    return NextResponse.json(session)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 