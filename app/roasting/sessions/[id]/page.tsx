import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoastingChart } from '@/components/RoastingChart';
import { ActionButtons } from './ActionButtons';
import { prisma } from '@/lib/prisma';
import { Toaster } from '@/components/ui/toaster';

interface Props {
  params: {
    id: string;
  };
}

export default async function RoastingSessionPage({ params }: Props) {
  const session = await prisma.roastingSession.findUnique({
    where: { id: params.id },
    include: {
      timePoints: true,
      bean: true,
    },
  });

  if (!session) {
    return <div>セッションが見つかりません</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-2 sm:px-4 py-2 sm:py-6 space-y-2 sm:space-y-6">
        {/* パンくず */}
        <div className="flex items-center gap-0.5 sm:gap-3 text-[10px] sm:text-base text-gray-600 min-w-0">
          <Link href="/roasting/sessions/list" className="hover:text-gray-900 shrink-0">検索結果</Link>
          <ChevronRight className="h-3 w-3 sm:h-5 sm:w-5 shrink-0" />
          <span className="text-gray-900 truncate min-w-0">
            {format(new Date(session.date), 'PPP', { locale: ja })}
            {' '}
            {session.bean.name}
          </span>
        </div>

        {/* アクションボタン */}
        <div>
          <ActionButtons 
            sessionId={session.id} 
            sessionDate={session.date} 
          />
        </div>

        {/* メタデータ */}
        <div className="grid gap-2 sm:gap-8 p-1.5 sm:p-8 bg-white rounded-lg">
          <div className="space-y-1 sm:space-y-3">
            <h2 className="text-sm sm:text-2xl font-bold line-clamp-2">{session.bean.name}</h2>
            <div className="flex flex-wrap gap-0.5 sm:gap-2">
              {session.bean.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-[8px] sm:text-base">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-6">
            <div className="space-y-0.5 sm:space-y-2">
              <p className="text-[8px] sm:text-base text-gray-500">焙煎日時</p>
              <p className="text-[8px] sm:text-lg font-medium">
                {format(new Date(session.date), 'PPP HH:mm', { locale: ja })}
              </p>
            </div>
            <div className="space-y-0.5 sm:space-y-2">
              <p className="text-[8px] sm:text-base text-gray-500">投入量</p>
              <p className="text-[8px] sm:text-lg font-medium">{session.inputWeight}g</p>
            </div>
            <div className="space-y-0.5 sm:space-y-2">
              <p className="text-[8px] sm:text-base text-gray-500">焼き上がり量</p>
              <p className="text-[8px] sm:text-lg font-medium">{session.outputWeight}g</p>
            </div>
            <div className="space-y-0.5 sm:space-y-2">
              <p className="text-[8px] sm:text-base text-gray-500">歩留まり</p>
              <p className="text-[8px] sm:text-lg font-medium">
                {Math.round((session.outputWeight / session.inputWeight) * 1000) / 10}%
              </p>
            </div>
            <div className="space-y-0.5 sm:space-y-2">
              <p className="text-[8px] sm:text-base text-gray-500">気温</p>
              <p className="text-[8px] sm:text-lg font-medium">{session.averageTemp.toFixed(1)}℃</p>
            </div>
            <div className="space-y-0.5 sm:space-y-2">
              <p className="text-[8px] sm:text-base text-gray-500">湿度</p>
              <p className="text-[8px] sm:text-lg font-medium">{session.averageHumidity.toFixed(1)}%</p>
            </div>
          </div>

          {session.notes && (
            <div className="space-y-0.5 sm:space-y-2">
              <p className="text-[8px] sm:text-base text-gray-500">備考</p>
              <p className="text-[8px] sm:text-lg text-gray-900">{session.notes}</p>
            </div>
          )}
        </div>

        {/* 温度グラフ */}
        <div className="bg-white rounded-lg shadow" id="roasting-chart">
          <div className="w-full h-[200px] sm:h-[400px] lg:h-[600px] p-0.5 sm:p-6">
            <div className="w-full h-full">
              <RoastingChart timePoints={session.timePoints} />
            </div>
          </div>
        </div>

        {/* タイミングデータテーブル */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="w-full px-2 sm:px-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[8px] sm:text-base whitespace-nowrap w-[22%] pl-2 sm:pl-6 pr-0.5 sm:pr-6">
                    <span className="hidden sm:inline">時刻</span>
                    <span className="sm:hidden">時刻</span>
                  </TableHead>
                  <TableHead className="text-[8px] sm:text-base whitespace-nowrap w-[18%] px-0.5 sm:px-6">
                    <span className="hidden sm:inline">焙煎温度</span>
                    <span className="sm:hidden">温度</span>
                  </TableHead>
                  <TableHead className="text-[8px] sm:text-base whitespace-nowrap w-[18%] px-0.5 sm:px-6">
                    <span className="hidden sm:inline">気温</span>
                    <span className="sm:hidden">気温</span>
                  </TableHead>
                  <TableHead className="text-[8px] sm:text-base whitespace-nowrap w-[18%] px-0.5 sm:px-6">
                    <span className="hidden sm:inline">湿度</span>
                    <span className="sm:hidden">湿度</span>
                  </TableHead>
                  <TableHead className="text-[8px] sm:text-base whitespace-nowrap w-[12%] px-0.5 sm:px-6">
                    <span className="hidden sm:inline">ハゼ1</span>
                    <span className="sm:hidden">1</span>
                  </TableHead>
                  <TableHead className="text-[8px] sm:text-base whitespace-nowrap w-[12%] px-0.5 sm:px-6">
                    <span className="hidden sm:inline">ハゼ2</span>
                    <span className="sm:hidden">2</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {session.timePoints.map((point, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-[8px] sm:text-base whitespace-nowrap w-[22%] pl-2 sm:pl-6 pr-0.5 sm:pr-6">
                      {format(new Date(point.timestamp), 'HH:mm:ss', { locale: ja })}
                    </TableCell>
                    <TableCell className="text-[8px] sm:text-base whitespace-nowrap w-[18%] px-0.5 sm:px-6">{point.temperature.toFixed(1)}</TableCell>
                    <TableCell className="text-[8px] sm:text-base whitespace-nowrap w-[18%] px-0.5 sm:px-6">{point.ambientTemperature.toFixed(1)}</TableCell>
                    <TableCell className="text-[8px] sm:text-base whitespace-nowrap w-[18%] px-0.5 sm:px-6">{point.humidity.toFixed(1)}</TableCell>
                    <TableCell className="text-[8px] sm:text-base whitespace-nowrap w-[12%] px-0.5 sm:px-6">{point.isFirstCrack ? '✓' : ''}</TableCell>
                    <TableCell className="text-[8px] sm:text-base whitespace-nowrap w-[12%] px-0.5 sm:px-6">{point.isSecondCrack ? '✓' : ''}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <Toaster />
      </div>
    </div>
  );
} 