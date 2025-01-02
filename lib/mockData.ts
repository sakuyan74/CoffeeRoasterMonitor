export interface TemperatureData {
  id: number;
  timestamp: string;
  temperature: number;
}

function generateRandomTemperature(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

export function generateMockData(days: number = 30): TemperatureData[] {
  const data: TemperatureData[] = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({
      id: i,
      timestamp: timestamp.toISOString().split('T')[0], // YYYY-MM-DD形式
      temperature: generateRandomTemperature(180, 220)
    });
  }
  
  return data.reverse();
}

