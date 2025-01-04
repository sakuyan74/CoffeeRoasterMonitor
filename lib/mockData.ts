import { RoastingSession } from './types';

// 固定の日付を使用
const baseDate = new Date('2024-01-01T10:00:00');

// 利用可能なタグの配列
const originTags = ['エチオピア', 'グアテマラ', 'ブラジル'];
const roastLevelTags = ['浅煎り', '中煎り', '深煎り'];

// モックの焙煎セッションデータ
export const mockRoastingSessions: RoastingSession[] = Array.from({ length: 50 }, (_, i) => {
  const sessionDate = new Date(baseDate);
  sessionDate.setDate(baseDate.getDate() + i);

  const timePoints = Array.from({ length: 20 }, (_, j) => {
    const timestamp = new Date(sessionDate);
    timestamp.setMinutes(timestamp.getMinutes() + j);
    
    return {
      timestamp: new Date(timestamp),
      temperature: 150 + Math.floor((j / 20) * 50),
      isFirstCrack: j === 10,
      isSecondCrack: j === 15,
    };
  });

  // インデックスを使用して決定論的にタグを選択
  const originTagIndex = i % originTags.length;
  const roastLevelTagIndex = Math.floor(i / originTags.length) % roastLevelTags.length;

  return {
    id: `session-${i + 1}`,
    metadata: {
      date: new Date(sessionDate),
      beanName: `${originTags[originTagIndex]}産コーヒー豆 ${i + 1}`,
      inputWeight: 200 + (i % 100),
      outputWeight: 160 + (i % 80),
      maxTemperature: 220 + (i % 20),
      minTemperature: 160 + (i % 20),
      humidity: 50 + (i % 20),
      tags: [
        originTags[originTagIndex],
        roastLevelTags[roastLevelTagIndex],
      ],
      notes: `焙煎メモ ${i + 1}`,
    },
    timePoints,
  };
});

export type SortField = 'date' | 'beanName';
export type SortOrder = 'asc' | 'desc';

// セッションのソート関数
export const sortSessions = (
  sessions: RoastingSession[],
  field: SortField,
  order: SortOrder
): RoastingSession[] => {
  return [...sessions].sort((a, b) => {
    let comparison = 0;
    if (field === 'date') {
      comparison = a.metadata.date.getTime() - b.metadata.date.getTime();
    } else if (field === 'beanName') {
      comparison = a.metadata.beanName.localeCompare(b.metadata.beanName);
    }
    return order === 'asc' ? comparison : -comparison;
  });
};

// 温度データ生成関数
export const generateMockData = () => {
  const data = [];
  const baseTime = new Date();
  baseTime.setMinutes(baseTime.getMinutes() - 30); // 30分前から開始

  for (let i = 0; i < 60; i++) {
    const time = new Date(baseTime);
    time.setSeconds(time.getSeconds() + i * 30); // 30秒間隔

    data.push({
      timestamp: new Date(time),
      temperature: 150 + Math.sin(i / 10) * 30 + Math.random() * 5,
    });
  }

  return data;
};

