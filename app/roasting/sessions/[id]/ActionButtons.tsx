'use client';

import { Button } from '@/components/ui/button';
import { FileDown, LineChart, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/hooks/use-toast';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ActionButtonsProps {
  sessionId: string;
  sessionDate: Date;
}

export function ActionButtons({ sessionId, sessionDate }: ActionButtonsProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleCSVDownload = async () => {
    try {
      const response = await fetch(`/api/roasting-sessions/${sessionId}/csv`);
      if (!response.ok) throw new Error('Failed to download CSV');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `roasting-session-${format(new Date(sessionDate), 'yyyyMMdd-HHmm', { locale: ja })}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast({
        title: "エラー",
        description: "CSVのダウンロードに失敗しました。",
        variant: "destructive",
      });
    }
  };

  const handleChartDownload = () => {
    try {
      const chartElement = document.querySelector('#roasting-chart') as HTMLElement;
      if (!chartElement) throw new Error('Chart element not found');

      // html2canvasをダイナミックインポート
      import('html2canvas').then(async (html2canvas) => {
        const canvas = await html2canvas.default(chartElement);
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `roasting-chart-${format(new Date(sessionDate), 'yyyyMMdd-HHmm', { locale: ja })}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    } catch (error) {
      console.error('Error downloading chart:', error);
      toast({
        title: "エラー",
        description: "グラフのダウンロードに失敗しました。",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-between items-center">
      <Button 
        variant="outline" 
        className="gap-1 sm:gap-2 h-8 sm:h-10 text-[10px] sm:text-sm px-2 sm:px-4"
        onClick={() => router.push(`/roasting/sessions/${sessionId}/edit`)}
      >
        <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
        編集
      </Button>

      <div className="flex gap-1 sm:gap-4">
        <Button 
          variant="outline" 
          className="gap-1 sm:gap-2 h-8 sm:h-10 text-[10px] sm:text-sm px-2 sm:px-4"
          onClick={handleCSVDownload}
        >
          <FileDown className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">CSVダウンロード</span>
          <span className="sm:hidden">CSV</span>
        </Button>
        <Button 
          variant="outline" 
          className="gap-1 sm:gap-2 h-8 sm:h-10 text-[10px] sm:text-sm px-2 sm:px-4"
          onClick={handleChartDownload}
        >
          <LineChart className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">グラフダウンロード</span>
          <span className="sm:hidden">グラフ</span>
        </Button>
      </div>
    </div>
  );
} 