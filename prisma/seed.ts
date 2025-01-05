const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// 豆の種類と焙煎度合いの配列
const origins = ['エチオピア', 'グアテマラ', 'ブラジル', 'コロンビア', 'ケニア']
const varieties = ['ティピカ', 'ブルボン', 'カトゥーラ', 'ゲイシャ']
const processes = ['ウォッシュド', 'ナチュラル', 'ハニー', 'アナエロビック']
const regions = {
  'エチオピア': ['イルガチェフェ', 'ゲイシャ', 'シダモ'],
  'グアテマラ': ['アンティグア', 'ウエウエテナンゴ', 'アティトラン'],
  'ブラジル': ['セラード', 'サントス', 'スルデミナス'],
  'コロンビア': ['ウイラ', 'ナリーニョ', 'カウカ'],
  'ケニア': ['ニエリ', 'キリニャガ', 'メル'],
}
const roastLevels = ['浅煎り', '中煎り', '深煎り']
const flavorTags = ['フルーティ', 'チョコレート', 'ナッツ', 'フローラル', 'シトラス', 'キャラメル']

async function main() {
  // デフォルト設定を作成
  const settings = await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      maxTemperature: 220,
      minTemperature: 0,
      sampleInterval: 1000,
    },
  })

  console.log('Created default settings:', settings)

  // 豆データを作成
  const beans = []
  for (const origin of origins) {
    const variety = varieties[Math.floor(Math.random() * varieties.length)]
    const process = processes[Math.floor(Math.random() * processes.length)]
    const region = regions[origin][Math.floor(Math.random() * regions[origin].length)]
    const tags = [
      origin,
      process,
      ...flavorTags.slice(0, 2 + Math.floor(Math.random() * 3)) // 2-4個のフレーバータグをランダムに選択
    ]

    const bean = await prisma.bean.create({
      data: {
        name: `${origin} ${region} ${variety}`,
        country: origin,
        region: region,
        farm: `${region}農園`,
        variety: variety,
        elevation: 1200 + Math.floor(Math.random() * 800), // 1200-2000m
        process: process,
        cropYear: '2023',
        grade: ['AA', 'A', 'SHB', 'Supremo'][Math.floor(Math.random() * 4)],
        description: `${origin}の${region}地域で栽培された${variety}種。${process}製法による処理で、${tags.slice(-2).join('と')}の風味が特徴です。`,
        tags: tags,
      }
    })

    console.log(`Created bean: ${bean.name}`)
    beans.push(bean)
  }

  // セッションデータを作成
  const baseDate = new Date('2024-01-01T10:00:00')
  
  for (let i = 0; i < 15; i++) {
    const sessionDate = new Date(baseDate)
    sessionDate.setDate(baseDate.getDate() - i)

    // ランダムな豆を選択
    const bean = beans[Math.floor(Math.random() * beans.length)]

    // タイムポイントのデータを生成
    const timePoints = []
    for (let j = 0; j < 20; j++) {
      const timestamp = new Date(sessionDate)
      timestamp.setMinutes(timestamp.getMinutes() + j)
      
      const ambientTemperature = 20 + Math.sin(j / 10) * 2.5
      const humidity = 50 + Math.sin(j / 8) * 5

      timePoints.push({
        timestamp,
        temperature: 150 + (j / 20) * 60 + Math.random() * 5,
        isFirstCrack: j === 10,
        isSecondCrack: j === 15,
        ambientTemperature,
        humidity,
      })
    }

    // 平均値を計算
    const averageTemp = timePoints.reduce((sum, point) => sum + point.ambientTemperature, 0) / timePoints.length
    const averageHumidity = timePoints.reduce((sum, point) => sum + point.humidity, 0) / timePoints.length

    // セッションを作成
    const session = await prisma.roastingSession.create({
      data: {
        date: sessionDate,
        beanName: bean.name,
        notes: `目標: ${roastLevels[Math.floor(Math.random() * roastLevels.length)]}。\n特徴: ${bean.tags.slice(-2).join('と')}の風味。`,
        inputWeight: 200 + Math.floor(Math.random() * 100),
        outputWeight: 160 + Math.floor(Math.random() * 80),
        beanId: bean.id,
        averageTemp,
        averageHumidity,
      },
    })

    // タイムポイントを作成
    for (const point of timePoints) {
      await prisma.roastingTimePoint.create({
        data: {
          ...point,
          sessionId: session.id,
        },
      })
    }

    console.log(`Created session ${i + 1}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 