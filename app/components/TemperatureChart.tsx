'use client';

import { useEffect, useState } from 'react';
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
  TimeScale 
} from 'chart.js';
import { TemperatureData } from '@/lib/mockData';
import { DateRange } from 'react-day-picker';
import 'chartjs-adapter-date-fns';
import { ja } from 'date-fns/locale';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  TimeScale
);

interface TemperatureChartProps {
  dateRange: DateRange | undefined;
}

export default function TemperatureChart({ dateRange }: TemperatureChartProps) {
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/temperature')
      .then(async response => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        return response.json();
      })
      .then((data: TemperatureData[]) => {
        if ('error' in data) {
          throw new Error(data.error as string);
        }
        
        // 日付範囲でデータをフィルタリング
        const filteredData = data.filter(item => {
          const itemDate = new Date(item.timestamp);
          return (!dateRange?.from || itemDate >= dateRange.from) &&
                 (!dateRange?.to || itemDate <= dateRange.to);
        });

        const chartData = {
          labels: filteredData.map((item) => new Date(item.timestamp)),
          datasets: [
            {
              label: '温度 (°C)',
              data: filteredData.map((item) => ({ x: new Date(item.timestamp), y: item.temperature })),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }
          ]
        };

        setChartData(chartData);
      })
      .catch(e => {
        console.error('データ取得エラー:', e);
        setError(e.message || 'Unknown error occurred');
      });
  }, [dateRange]);

  if (error) {
    return <div className="text-red-500">エラーが発生しました: {error}</div>;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            day: 'MM/dd'
          }
        },
        title: {
          display: true,
          text: '日付'
        },
        adapters: {
          date: {
            locale: ja
          }
        }
      },
      y: {
        title: {
          display: true,
          text: '温度 (°C)'
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">温度グラフ</h2>
      <div className="h-[400px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

