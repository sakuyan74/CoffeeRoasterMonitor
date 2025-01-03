'use client'

import { ReactNode } from 'react';
import DownloadButtons from './DownloadButtons';
import { DateRangePicker } from './DateRangePicker';
import { DateRange } from 'react-day-picker';
import { BarChart3, Settings, Home } from 'lucide-react';
import { Button } from './ui/button';

interface LayoutProps {
  children: ReactNode;
  onDateRangeChange: (range: DateRange | undefined) => void;
  dateRange: DateRange | undefined;
}

export default function Layout({ children, onDateRangeChange, dateRange }: LayoutProps) {
  return (
    <div className="min-h-screen">
      {/* サイドバー */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-20">
        <div className="flex flex-col h-full p-4">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-800">コーヒー焙煎モニター</h1>
          </div>
          <nav className="flex-1 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 hover:bg-gray-100"
            >
              <Home className="w-5 h-5" />
              <span>ホーム</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 hover:bg-gray-100"
            >
              <BarChart3 className="w-5 h-5" />
              <span>統計</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 hover:bg-gray-100"
            >
              <Settings className="w-5 h-5" />
              <span>設定</span>
            </Button>
          </nav>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <div className="pl-64 w-full min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">温度モニター</h2>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <DateRangePicker onDateRangeChange={onDateRangeChange} />
                  <div className="flex gap-2">
                    <DownloadButtons dateRange={dateRange} />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

