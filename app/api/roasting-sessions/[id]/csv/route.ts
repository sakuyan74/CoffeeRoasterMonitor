import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

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

    // CSVヘッダー
    const headers = [
      '時刻',
      '豆温度(℃)',
      '気温(℃)',
      '湿度(%)',
      'ハゼ1',
      'ハゼ2',
    ].join(',')

    // CSVデータ行
    const rows = session.timePoints.map(point => [
      format(new Date(point.timestamp), 'HH:mm:ss', { locale: ja }),
      point.temperature.toFixed(1),
      point.ambientTemperature.toFixed(1),
      point.humidity.toFixed(1),
      point.isFirstCrack ? '✓' : '',
      point.isSecondCrack ? '✓' : '',
    ].join(','))

    // CSVデータの組み立て
    const csv = [headers, ...rows].join('\n')

    // ファイル名の生成
    const fileName = `roasting-session-${format(new Date(session.date), 'yyyyMMdd-HHmm', { locale: ja })}.csv`

    // レスポンスヘッダーの設定
    const headers_obj = new Headers()
    headers_obj.set('Content-Type', 'text/csv')
    headers_obj.set('Content-Disposition', `attachment; filename="${fileName}"`)

    return new Response(csv, {
      headers: headers_obj,
    })
  } catch (error) {
    console.error('Error generating CSV:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 