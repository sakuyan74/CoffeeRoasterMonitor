'use client';

import { useCallback } from 'react';
import { TemperatureData } from '@/lib/mockData';
import { DateRange } from 'react-day-picker';

interface DownloadButtonsProps {
  dateRange: DateRange | undefined;
}

export default function DownloadButtons({ dateRange }: DownloadButtonsProps) {
  const downloadCSV = useCallback(() => {
    fetch('/api/temperature')
      .then(response => response.json())
      .then((data: TemperatureData[]) => {
        // 日付範囲でデータをフィルタリング
        const filteredData = data.filter(item => {
          const itemDate = new Date(item.timestamp);
          return (!dateRange?.from || itemDate >= dateRange.from) &&
                 (!dateRange?.to || itemDate <= dateRange.to);
        });

        const csvContent = "data:text/csv;charset=utf-8," 
          + "日時,温度\n"
          + filteredData.map((row) => `${row.timestamp},${row.temperature}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "temperature_data.csv");
        document.body.appendChild(link);
        link.click();
      });
  }, [dateRange]);

  const downloadPNG = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'temperature_chart.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  }, []);

  return (
    <div className="flex space-x-4">
      <button onClick={downloadCSV} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        CSVダウンロード
      </button>
      <button onClick={downloadPNG} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        グラフ画像ダウンロード
      </button>
    </div>
  );
}

