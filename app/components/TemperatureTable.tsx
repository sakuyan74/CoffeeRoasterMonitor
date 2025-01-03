'use client';

import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface TemperatureData {
  timestamp: string;
  temperature: number;
}

interface TemperatureTableProps {
  dateRange: DateRange | undefined;
}

export default function TemperatureTable({ dateRange }: TemperatureTableProps) {
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              日時
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              温度 (℃)
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {format(new Date(item.timestamp), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.temperature}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

