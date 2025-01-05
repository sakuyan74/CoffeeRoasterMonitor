'use client';

import React from 'react';
import { RoastingTimePoint } from '@/lib/types';
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
  ChartOptions,
  ScriptableContext,
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

interface RoastingChartProps {
  timePoints: RoastingTimePoint[];
}

export function RoastingChart({ timePoints }: RoastingChartProps) {
  const [options, setOptions] = React.useState<ChartOptions<'line'>>({
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    devicePixelRatio: window.devicePixelRatio > 1 ? 2 : 1,
    layout: {
      padding: {
        left: 4,
        right: 4,
        top: 4,
        bottom: 4
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'center',
        labels: {
          boxWidth: 8,
          padding: 4,
          font: {
            size: 10,
            family: "'Noto Sans JP', sans-serif",
          },
        },
      },
      title: {
        display: true,
        text: '焙煎温度推移',
        font: {
          size: 12,
          weight: 'bold' as const,
          family: "'Noto Sans JP', sans-serif",
        },
        padding: { bottom: 8 },
      },
      tooltip: {
        titleFont: {
          size: 12,
          family: "'Noto Sans JP', sans-serif",
        },
        bodyFont: {
          size: 12,
          family: "'Noto Sans JP', sans-serif",
        },
        padding: 8,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toFixed(1)}`;
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
          text: '焙煎温度 (℃)',
          font: {
            size: 12,
            family: "'Noto Sans JP', sans-serif",
          },
        },
        ticks: {
          font: {
            size: 10,
            family: "'Noto Sans JP', sans-serif",
          },
          padding: 2,
          maxTicksLimit: 8,
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
          font: {
            size: 12,
            family: "'Noto Sans JP', sans-serif",
          },
        },
        ticks: {
          font: {
            size: 10,
            family: "'Noto Sans JP', sans-serif",
          },
          padding: 2,
          maxTicksLimit: 8,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        title: {
          display: true,
          text: '時刻',
          font: {
            size: 12,
            family: "'Noto Sans JP', sans-serif",
          },
          padding: { top: 4 },
        },
        ticks: {
          font: {
            size: 10,
            family: "'Noto Sans JP', sans-serif",
          },
          maxRotation: 45,
          minRotation: 45,
          padding: 2,
          autoSkip: true,
          maxTicksLimit: 8,
        },
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  });

  // ブレークポイントに応じてフォントサイズを調整
  const updateFontSizes = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      const isSmallScreen = window.matchMedia('(max-width: 640px)').matches;
      const isLargeScreen = window.matchMedia('(min-width: 1024px)').matches;
      const screenWidth = window.innerWidth;
      
      // 画面幅に応じてX軸の目盛り数を計算
      const calculateMaxTicks = () => {
        if (screenWidth <= 640) return 8;  // モバイル
        if (screenWidth <= 768) return 12; // タブレット（小）
        if (screenWidth <= 1024) return 16; // タブレット（大）
        if (screenWidth <= 1280) return 20; // デスクトップ
        return 24; // ワイドスクリーン
      };

      setOptions(prev => ({
        ...prev,
        plugins: {
          ...prev.plugins,
          legend: {
            ...prev.plugins?.legend,
            labels: {
              ...prev.plugins?.legend?.labels,
              boxWidth: isLargeScreen ? 16 : isSmallScreen ? 8 : 12,
              padding: isLargeScreen ? 8 : isSmallScreen ? 4 : 6,
              font: {
                size: isLargeScreen ? 16 : isSmallScreen ? 8 : 12,
                family: "'Noto Sans JP', sans-serif",
              },
            },
          },
          title: {
            ...prev.plugins?.title,
            font: {
              size: isLargeScreen ? 20 : isSmallScreen ? 10 : 14,
              weight: 'bold',
              family: "'Noto Sans JP', sans-serif",
            },
            padding: { bottom: isLargeScreen ? 16 : isSmallScreen ? 8 : 12 },
          },
          tooltip: {
            ...prev.plugins?.tooltip,
            titleFont: {
              size: isLargeScreen ? 16 : isSmallScreen ? 10 : 12,
              family: "'Noto Sans JP', sans-serif",
            },
            bodyFont: {
              size: isLargeScreen ? 16 : isSmallScreen ? 10 : 12,
              family: "'Noto Sans JP', sans-serif",
            },
            padding: isLargeScreen ? 12 : isSmallScreen ? 8 : 10,
          },
        },
        scales: {
          ...prev.scales,
          y: {
            ...prev.scales?.y,
            title: {
              ...prev.scales?.y?.title,
              text: '焙煎温度 (℃)',
              font: {
                size: isLargeScreen ? 16 : isSmallScreen ? 10 : 12,
                family: "'Noto Sans JP', sans-serif",
              },
            },
            ticks: {
              ...prev.scales?.y?.ticks,
              font: {
                size: isLargeScreen ? 14 : isSmallScreen ? 8 : 10,
                family: "'Noto Sans JP', sans-serif",
              },
              padding: isLargeScreen ? 8 : isSmallScreen ? 2 : 4,
            },
          },
          y1: {
            ...prev.scales?.y1,
            title: {
              ...prev.scales?.y1?.title,
              font: {
                size: isLargeScreen ? 16 : isSmallScreen ? 10 : 12,
                family: "'Noto Sans JP', sans-serif",
              },
            },
            ticks: {
              ...prev.scales?.y1?.ticks,
              font: {
                size: isLargeScreen ? 14 : isSmallScreen ? 8 : 10,
                family: "'Noto Sans JP', sans-serif",
              },
              padding: isLargeScreen ? 8 : isSmallScreen ? 2 : 4,
            },
          },
          x: {
            ...prev.scales?.x,
            title: {
              ...prev.scales?.x?.title,
              font: {
                size: isLargeScreen ? 16 : isSmallScreen ? 10 : 12,
                family: "'Noto Sans JP', sans-serif",
              },
              padding: { top: isLargeScreen ? 8 : isSmallScreen ? 4 : 6 },
            },
            ticks: {
              ...prev.scales?.x?.ticks,
              font: {
                size: isLargeScreen ? 14 : isSmallScreen ? 8 : 10,
                family: "'Noto Sans JP', sans-serif",
              },
              maxRotation: 45,
              minRotation: 45,
              padding: isLargeScreen ? 8 : isSmallScreen ? 2 : 4,
              autoSkip: true,
              maxTicksLimit: calculateMaxTicks(),
            },
          },
        },
      }));
    }
  }, []);

  // コンポーネントマウント時とリサイズ時にフォントサイズを更新
  React.useEffect(() => {
    updateFontSizes();
    const handleResize = () => {
      updateFontSizes();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateFontSizes]);

  const chartData = {
    labels: timePoints.map(point => 
      format(new Date(point.timestamp), 'HH:mm:ss', { locale: ja })
    ),
    datasets: [
      {
        label: '焙煎温度 (℃)',
        data: timePoints.map(point => point.temperature),
        borderColor: 'rgb(234, 88, 12)',
        backgroundColor: 'rgba(234, 88, 12, 0.5)',
        tension: 0.3,
        pointRadius: 1,
        pointHoverRadius: 3,
        yAxisID: 'y',
      },
      {
        label: '気温 (℃)',
        data: timePoints.map(point => point.ambientTemperature),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
        pointRadius: 1,
        pointHoverRadius: 3,
        yAxisID: 'y1',
      }
    ]
  };

  return <Line options={options} data={chartData} />;
} 