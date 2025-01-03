// 焙煎のタイミングデータの型定義
export interface RoastingTimePoint {
  timestamp: Date;        // 測定時刻
  temperature: number;    // 温度
  isFirstCrack: boolean; // ハゼ1タイミング
  isSecondCrack: boolean; // ハゼ2タイミング
}

// 焙煎1回分のメタデータの型定義
export interface RoastingMetadata {
  date: Date;             // 焙煎日
  minTemperature: number; // その日の最低気温
  maxTemperature: number; // その日の最高気温
  humidity: number;       // 湿度
  beanName: string;       // 豆の名前
  inputWeight: number;    // 豆の投入量(g)
  outputWeight: number;   // 焼き上がり量(g)
  notes: string;          // 備考
  tags: string[];         // タグ（複数可）
}

// 焙煎1回分の完全なデータの型定義
export interface RoastingSession {
  id: string;             // セッションID
  metadata: RoastingMetadata;  // メタデータ
  timePoints: RoastingTimePoint[]; // 30秒単位の計測データ配列
}

// APIレスポンスの型定義
export interface RoastingSessionsResponse {
  sessions: RoastingSession[];
  total: number;          // 総セッション数
}

// 検索・フィルタリング用のクエリパラメータの型定義
export interface RoastingQueryParams {
  startDate?: Date;       // 開始日
  endDate?: Date;         // 終了日
  beanName?: string;      // 豆の名前でフィルタ
  tags?: string[];        // タグでフィルタ
  page?: number;          // ページネーション用
  limit?: number;         // 1ページあたりの件数
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