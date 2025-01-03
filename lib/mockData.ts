import { RoastingSession } from './types';

// モックデータ生成用のヘルパー関数
function generateTimePoints(startTime: Date, duration: number) {
  const timePoints = [];
  const firstCrackTiming = Math.floor(duration * 0.6);
  const secondCrackTiming = Math.floor(duration * 0.8);

  for (let i = 0; i < duration; i++) {
    const timestamp = new Date(startTime.getTime() + i * 30000);
    const temperature = 150 + Math.floor(i * (230 - 150) / duration + Math.random() * 5);
    timePoints.push({
      timestamp,
      temperature,
      isFirstCrack: i === firstCrackTiming,
      isSecondCrack: i === secondCrackTiming,
    });
  }
  return timePoints;
}

// リアルタイムデータ生成用の関数
export function generateMockData() {
  const now = new Date();
  const data = [];
  
  // 過去30分のデータを30秒間隔で生成
  for (let i = 0; i < 60; i++) {
    const timestamp = new Date(now.getTime() - (60 - i) * 30000);
    const temperature = 180 + Math.sin(i / 10) * 30 + Math.random() * 5;
    
    data.push({
      timestamp: timestamp.toISOString(),
      temperature: Math.round(temperature),
    });
  }
  
  return data;
}

// サンプルの豆データ
const sampleBeans = [
  { name: 'エチオピア イルガチェフェ G1', tags: ['エチオピア', 'フルーティ', '浅煎り'] },
  { name: 'グアテマラ アンティグア', tags: ['グアテマラ', 'チョコレート', '中煎り'] },
  { name: 'ブラジル サントス No.2', tags: ['ブラジル', 'ナッツ', '深煎り'] },
  { name: 'コロンビア スプレモ', tags: ['コロンビア', 'キャラメル', '中煎り'] },
  { name: 'ケニア AA', tags: ['ケニア', 'フルーティ', '浅煎り'] },
  { name: 'インドネシア マンデリン', tags: ['インドネシア', 'アース', '深煎り'] },
  { name: 'コスタリカ タラス', tags: ['コスタリカ', 'ナッツ', '中煎り'] },
  { name: 'イエメン モカ マタリ', tags: ['イエメン', 'スパイシー', '浅煎り'] },
];

// モックデータの生成（50件）
export const mockRoastingSessions: RoastingSession[] = Array.from({ length: 50 }).map((_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 60)); // 過去60日のランダムな日付
  date.setHours(Math.floor(Math.random() * 12) + 8); // 8時〜20時の間
  
  const bean = sampleBeans[index % sampleBeans.length];
  const inputWeight = 200 + Math.floor(Math.random() * 100);
  const lossPercentage = 15 + Math.random() * 5;
  const outputWeight = Math.floor(inputWeight * (100 - lossPercentage) / 100);

  return {
    id: `session-${index + 1}`,
    metadata: {
      date,
      minTemperature: 18 + Math.floor(Math.random() * 5),
      maxTemperature: 25 + Math.floor(Math.random() * 5),
      humidity: 50 + Math.floor(Math.random() * 20),
      beanName: bean.name,
      inputWeight,
      outputWeight,
      notes: `${bean.name}の標準的な焙煎。ハゼ音は${8 + Math.floor(Math.random() * 2)}分頃から。`,
      tags: bean.tags,
    },
    timePoints: generateTimePoints(date, 40),
  };
});

// ソート関数
export type SortField = 'date' | 'beanName';
export type SortOrder = 'asc' | 'desc';

export function sortSessions(
  sessions: RoastingSession[],
  field: SortField,
  order: SortOrder
): RoastingSession[] {
  return [...sessions].sort((a, b) => {
    let comparison = 0;
    
    switch (field) {
      case 'date':
        comparison = new Date(a.metadata.date).getTime() - new Date(b.metadata.date).getTime();
        break;
      case 'beanName':
        comparison = a.metadata.beanName.localeCompare(b.metadata.beanName);
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });
}

// APIレスポンスのモック
export function getMockRoastingSessions(startDate?: Date, endDate?: Date) {
  let filteredSessions = mockRoastingSessions;

  if (startDate && endDate) {
    filteredSessions = filteredSessions.filter(session => 
      session.metadata.date >= startDate && session.metadata.date <= endDate
    );
  }

  return {
    sessions: filteredSessions,
    total: filteredSessions.length,
  };
}

// CSVデータへの変換
export function convertToCSV(sessions: RoastingSession[]) {
  const rows: string[] = [];
  
  // ヘッダー行
  rows.push([
    'セッションID',
    '日付',
    '最低気温',
    '最高気温',
    '湿度',
    '豆の名前',
    '投入量(g)',
    '焼き上がり量(g)',
    '備考',
    'タグ',
    '計測時刻',
    '温度',
    'ハゼ1',
    'ハゼ2'
  ].join(','));

  // データ行
  sessions.forEach(session => {
    session.timePoints.forEach(point => {
      rows.push([
        session.id,
        session.metadata.date.toISOString(),
        session.metadata.minTemperature,
        session.metadata.maxTemperature,
        session.metadata.humidity,
        `"${session.metadata.beanName}"`,
        session.metadata.inputWeight,
        session.metadata.outputWeight,
        `"${session.metadata.notes}"`,
        `"${session.metadata.tags.join(';')}"`,
        point.timestamp.toISOString(),
        point.temperature,
        point.isFirstCrack ? 1 : 0,
        point.isSecondCrack ? 1 : 0
      ].join(','));
    });
  });

  return rows.join('\n');
}

