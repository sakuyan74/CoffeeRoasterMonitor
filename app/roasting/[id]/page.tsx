import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileDown, LineChart, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from '@/lib/prisma';
import { RoastingChart } from './RoastingChart';
import { notFound } from 'next/navigation';

interface RoastingTimePoint {
  id: string;
  timestamp: Date;
  temperature: number;
  isFirstCrack: boolean;
  isSecondCrack: boolean;
  ambientTemperature: number;
  humidity: number;
}

interface Bean {
  id: string;
  name: string;
  tags: string[];
}

interface RoastingSession {
  id: string;
  date: Date;
  beanName: string;
  notes?: string;
  inputWeight: number;
  outputWeight: number;
  timePoints: RoastingTimePoint[];
  bean: Bean;
}

export default async function RoastingDetailPage({
  params
}: {
  params: { id: string }
}) {
  const session = await prisma.roastingSession.findUnique({
    where: { id: params.id },
    include: {
      timePoints: true,
      bean: true,
    },
  });

  if (!session) {
    notFound();
  }

  // 平均温度と湿度を計算
  const averageTemp = session.timePoints.reduce((sum: number, point: RoastingTimePoint) => 
    sum + point.ambientTemperature, 0
  ) / session.timePoints.length;
  
  const averageHumidity = session.timePoints.reduce((sum: number, point: RoastingTimePoint) => 
    sum + point.humidity, 0
  ) / session.timePoints.length;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 lg:max-w-5xl">
      {/* パンくず */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/search" className="hover:text-gray-900">検索結果</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 line-clamp-1">
          {format(session.date, 'PPP', { locale: ja })}
          {' '}
          {session.bean.name}
        </span>
      </div>

      {/* アクションボタン */}
      <div className="flex flex-wrap gap-4">
        <Button variant="outline" className="gap-2">
          <FileDown className="h-4 w-4" />
          CSVダウンロード
        </Button>
        <Button variant="outline" className="gap-2">
          <LineChart className="h-4 w-4" />
          グラフダウンロード
        </Button>
      </div>

      {/* メタデータ */}
      <div className="grid gap-6 p-4 sm:p-6 bg-gray-50 rounded-lg">
        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-bold line-clamp-2">{session.bean.name}</h2>
          <div className="flex flex-wrap gap-1.5">
            {session.bean.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs sm:text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-gray-500">焙煎日時</p>
            <p className="text-sm sm:text-base font-medium">
              {format(session.date, 'PPP HH:mm', { locale: ja })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-gray-500">投入量</p>
            <p className="text-sm sm:text-base font-medium">{session.inputWeight}g</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-gray-500">焼き上がり量</p>
            <p className="text-sm sm:text-base font-medium">{session.outputWeight}g</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-gray-500">歩留まり</p>
            <p className="text-sm sm:text-base font-medium">
              {Math.round((session.outputWeight / session.inputWeight) * 1000) / 10}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-gray-500">平均気温</p>
            <p className="text-sm sm:text-base font-medium">{averageTemp.toFixed(1)}℃</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-gray-500">平均湿度</p>
            <p className="text-sm sm:text-base font-medium">{averageHumidity.toFixed(1)}%</p>
          </div>
        </div>

        {session.notes && (
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-gray-500">備考</p>
            <p className="text-sm sm:text-base text-gray-900">{session.notes}</p>
          </div>
        )}
      </div>

      {/* 温度グラフ */}
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
        <RoastingChart timePoints={session.timePoints} />
      </div>

      {/* タイミングデータテーブル */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">時刻</TableHead>
              <TableHead className="text-xs sm:text-sm">豆の温度</TableHead>
              <TableHead className="text-xs sm:text-sm">気温</TableHead>
              <TableHead className="text-xs sm:text-sm">湿度</TableHead>
              <TableHead className="text-xs sm:text-sm">ハゼ1</TableHead>
              <TableHead className="text-xs sm:text-sm">ハゼ2</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {session.timePoints.map((point: RoastingTimePoint, index: number) => (
              <TableRow key={index}>
                <TableCell className="text-xs sm:text-sm">
                  {format(point.timestamp, 'HH:mm:ss', { locale: ja })}
                </TableCell>
                <TableCell className="text-xs sm:text-sm">{point.temperature.toFixed(1)}℃</TableCell>
                <TableCell className="text-xs sm:text-sm">{point.ambientTemperature.toFixed(1)}℃</TableCell>
                <TableCell className="text-xs sm:text-sm">{point.humidity.toFixed(1)}%</TableCell>
                <TableCell className="text-xs sm:text-sm">{point.isFirstCrack ? '✓' : ''}</TableCell>
                <TableCell className="text-xs sm:text-sm">{point.isSecondCrack ? '✓' : ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 