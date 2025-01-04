'use client';

import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
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

interface TemperatureData {
  timestamp: string;
  temperature: number;
}

interface TemperatureChartProps {
  dateRange: DateRange | undefined;
}

export default function TemperatureChart({ dateRange }: TemperatureChartProps) {
  const [data, setData] = useState<TemperatureData[]>([]);

  useEffect(() => {
    fetch('/api/temperature')
      .then(response => response.json())
      .then(data => {
        // 日付範囲でフィルタリング
        const filteredData = data.filter((item: TemperatureData) => {
          const itemDate = new Date(item.timestamp);
          return (!dateRange?.from || itemDate >= dateRange.from) &&
                 (!dateRange?.to || itemDate <= dateRange.to);
        });
        setData(filteredData);
      });
  }, [dateRange]);

  const chartData = {
    datasets: [
      {
        label: '温度 (℃)',
        data: data.map(item => ({
          x: new Date(item.timestamp),
          y: item.temperature
        })),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day' as const,
          displayFormats: {
            day: 'MM/dd'
          }
        },
        adapters: {
          date: {
            locale: ja
          }
        },
        title: {
          display: true,
          text: '日付'
        }
      },
      y: {
        title: {
          display: true,
          text: '温度 (℃)'
        },
        min: 150,
        max: 250,
      }
    }
  };

  return (
    <div className="w-full h-[400px] bg-white rounded-lg p-4">
      <Line data={chartData} options={options} />
    </div>
  );
}

