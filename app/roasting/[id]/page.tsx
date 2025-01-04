'use client';

import { useParams } from 'next/navigation';
import { mockRoastingSessions } from '@/lib/mockData';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { FileDown, LineChart, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Chart.jsの設定
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function RoastingDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const session = mockRoastingSessions.find(s => s.id === `session-${id}`);

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">焙煎データが見つかりません</p>
        <Link href="/search" className="text-blue-500 hover:text-blue-700 mt-4 inline-block">
          検索画面に戻る
        </Link>
      </div>
    );
  }

  // グラフデータの準備
  const chartData = {
    labels: session.timePoints.map(point => 
      format(new Date(point.timestamp), 'HH:mm:ss', { locale: ja })
    ),
    datasets: [
      {
        label: '温度 (℃)',
        data: session.timePoints.map(point => point.temperature),
        borderColor: 'rgb(234, 88, 12)',
        backgroundColor: 'rgba(234, 88, 12, 0.5)',
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5,
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '焙煎温度推移',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `温度: ${context.parsed.y}℃`,
        },
      },
    },
    scales: {
      y: {
        min: 140,
        max: 240,
        title: {
          display: true,
          text: '温度 (℃)',
        },
      },
      x: {
        title: {
          display: true,
          text: '時刻',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 lg:max-w-5xl">
      {/* パンくず */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/search" className="hover:text-gray-900">検索結果</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 line-clamp-1">
          {format(session.metadata.date, 'PPP', { locale: ja })}
          {' '}
          {session.metadata.beanName}
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
          <h2 className="text-lg sm:text-xl font-bold line-clamp-2">{session.metadata.beanName}</h2>
          <div className="flex flex-wrap gap-1.5">
            {session.metadata.tags.map((tag) => (
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
              {format(session.metadata.date, 'PPP HH:mm', { locale: ja })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-gray-500">投入量</p>
            <p className="text-sm sm:text-base font-medium">{session.metadata.inputWeight}g</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-gray-500">焼き上がり量</p>
            <p className="text-sm sm:text-base font-medium">{session.metadata.outputWeight}g</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-gray-500">歩留まり</p>
            <p className="text-sm sm:text-base font-medium">
              {Math.round((session.metadata.outputWeight / session.metadata.inputWeight) * 1000) / 10}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-gray-500">最高気温</p>
            <p className="text-sm sm:text-base font-medium">{session.metadata.maxTemperature}℃</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-gray-500">最低気温</p>
            <p className="text-sm sm:text-base font-medium">{session.metadata.minTemperature}℃</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-gray-500">湿度</p>
            <p className="text-sm sm:text-base font-medium">{session.metadata.humidity}%</p>
          </div>
        </div>

        {session.metadata.notes && (
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-gray-500">備考</p>
            <p className="text-sm sm:text-base text-gray-900">{session.metadata.notes}</p>
          </div>
        )}
      </div>

      {/* 温度グラフ */}
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
        <Line options={chartOptions} data={chartData} />
      </div>

      {/* タイミングデータテーブル */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">時刻</TableHead>
              <TableHead className="text-xs sm:text-sm">温度</TableHead>
              <TableHead className="text-xs sm:text-sm">ハゼ1</TableHead>
              <TableHead className="text-xs sm:text-sm">ハゼ2</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {session.timePoints.map((point, index) => (
              <TableRow key={index}>
                <TableCell className="text-xs sm:text-sm">
                  {format(point.timestamp, 'HH:mm:ss', { locale: ja })}
                </TableCell>
                <TableCell className="text-xs sm:text-sm">{point.temperature}℃</TableCell>
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