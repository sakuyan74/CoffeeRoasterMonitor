'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
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

interface RoastingTimePoint {
  id: string;
  timestamp: Date;
  temperature: number;
  isFirstCrack: boolean;
  isSecondCrack: boolean;
  ambientTemperature: number;
  humidity: number;
}

interface RoastingChartProps {
  timePoints: RoastingTimePoint[];
}

export function RoastingChart({ timePoints }: RoastingChartProps) {
  const chartData = {
    labels: timePoints.map(point => 
      format(new Date(point.timestamp), 'HH:mm:ss', { locale: ja })
    ),
    datasets: [
      {
        label: '豆の温度 (℃)',
        data: timePoints.map(point => point.temperature),
        borderColor: 'rgb(234, 88, 12)',
        backgroundColor: 'rgba(234, 88, 12, 0.5)',
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5,
        yAxisID: 'y',
      },
      {
        label: '気温 (℃)',
        data: timePoints.map(point => point.ambientTemperature),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5,
        yAxisID: 'y1',
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
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toFixed(1)}℃`;
          },
        },
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 140,
        max: 240,
        title: {
          display: true,
          text: '豆の温度 (℃)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 15,
        max: 30,
        title: {
          display: true,
          text: '気温 (℃)',
        },
        grid: {
          drawOnChartArea: false,
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

  return <Line options={chartOptions} data={chartData} />;
} 