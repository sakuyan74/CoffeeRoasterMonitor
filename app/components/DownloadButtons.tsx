'use client';

import { DateRange } from 'react-day-picker';
import { Button } from './ui/button';
import { Download, FileDown, LineChart } from 'lucide-react';

interface DownloadButtonsProps {
  dateRange: DateRange | undefined;
}

export default function DownloadButtons({ dateRange }: DownloadButtonsProps) {
  const handleDownload = async (format: 'csv' | 'pdf') => {
    if (!dateRange?.from || !dateRange?.to) return;

    const params = new URLSearchParams({
      from: dateRange.from.toISOString(),
      to: dateRange.to.toISOString(),
      format: format
    });

    const response = await fetch(`/api/download?${params.toString()}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `temperature-data.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => handleDownload('csv')}
        disabled={!dateRange?.from || !dateRange?.to}
        className="shadow-sm hover:shadow transition-all"
      >
        <FileDown className="mr-2 h-4 w-4" />
        CSVデータ
      </Button>
      <Button
        variant="outline"
        onClick={() => handleDownload('pdf')}
        disabled={!dateRange?.from || !dateRange?.to}
        className="shadow-sm hover:shadow transition-all"
      >
        <LineChart className="mr-2 h-4 w-4" />
        グラフ
      </Button>
    </div>
  );
}

