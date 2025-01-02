'use client';

import { useEffect, useState } from 'react';
import { TemperatureData } from '@/lib/mockData';
import { DateRange } from 'react-day-picker';

interface TemperatureTableProps {
  dateRange: DateRange | undefined;
}

export default function TemperatureTable({ dateRange }: TemperatureTableProps) {
  const [temperatures, setTemperatures] = useState<TemperatureData[]>([]);
  const [error, setError] = useState(null);

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
        if (data.error) {
          throw new Error(data.error);
        }
        
        // 日付範囲でデータをフィルタリング
        const filteredData = data.filter(item => {
          const itemDate = new Date(item.timestamp);
          return (!dateRange?.from || itemDate >= dateRange.from) &&
                 (!dateRange?.to || itemDate <= dateRange.to);
        });

        setTemperatures(filteredData);
      })
      .catch(e => {
        console.error('データ取得エラー:', e);
        setError(e.message || 'Unknown error occurred');
      });
  }, [dateRange]);

  if (error) {
    return <div className="text-red-500">エラーが発生しました: {error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">温度データ</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">日時</th>
              <th className="border border-gray-300 px-4 py-2">温度 (°C)</th>
            </tr>
          </thead>
          <tbody>
            {temperatures.map((item: TemperatureData) => (
              <tr key={item.id}>
                <td className="border border-gray-300 px-4 py-2">{item.timestamp}</td>
                <td className="border border-gray-300 px-4 py-2">{item.temperature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

