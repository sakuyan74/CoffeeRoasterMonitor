// 焙煎のタイミングデータの型定義
export interface RoastingTimePoint {
  id: string;
  timestamp: Date;        // 測定時刻
  temperature: number;    // 豆の温度
  isFirstCrack: boolean; // ハゼ1タイミング
  isSecondCrack: boolean; // ハゼ2タイミング
  ambientTemperature: number; // 気温
  humidity: number;      // 湿度
}

// 豆マスタの型定義
export interface Bean {
  id: string;
  name: string;
  country: string;
  region: string | null;
  farm: string | null;
  variety: string;
  elevation: number | null;
  process: string;
  cropYear: string;
  grade: string | null;
  description: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 豆マスタのフォーム用の型定義
export interface BeanFormData {
  name: string;
  country: string;
  region: string | null;
  farm: string | null;
  variety: string;
  elevation: number | null;
  process: string;
  cropYear: string;
  grade: string | null;
  description: string | null;
  tags: string[];
}

// 焙煎セッションの型定義
export interface RoastingSession {
  id: string;
  date: Date;
  beanId: string;
  beanName: string;
  notes: string | null;
  inputWeight: number;
  outputWeight: number;
  averageTemp: number;
  averageHumidity: number;
  timePoints: RoastingTimePoint[];
  bean: Bean;
}

// APIレスポンスの型定義
export interface RoastingSessionsResponse {
  sessions: RoastingSession[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

// 検索・フィルタリング用のクエリパラメータの型定義
export interface RoastingQueryParams {
  startDate?: Date;
  endDate?: Date;
  beanName?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  tempRange?: { min: number; max: number };
  humidityRange?: { min: number; max: number };
}

// CSVエクスポート用のフラット化されたデータ型
export interface RoastingSessionCSV {
  sessionId: string;
  date: string;
  minTemperature: number;
  maxTemperature: number;
  humidity: number;
  beanName: string;
  inputWeight: number;
  outputWeight: number;
  notes: string;
  tags: string;
  measurementTime: string;
  temperature: number;
  isFirstCrack: boolean;
  isSecondCrack: boolean;
} 