'use client'

import { ReactNode } from 'react';
import DownloadButtons from './DownloadButtons';
import { DateRangePicker } from './DateRangePicker';
import { DateRange } from 'react-day-picker';
import { BarChart3, Settings, Home, Search } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: typeof Home;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'ホーム', href: '/' },
  { icon: Search, label: '検索', href: '/search' },
  { icon: BarChart3, label: '統計', href: '/statistics' },
  { icon: Settings, label: '設定', href: '/settings' },
];

interface LayoutProps {
  children: ReactNode;
  onDateRangeChange: (range: DateRange | undefined) => void;
  dateRange: DateRange | undefined;
}

export default function Layout({ children, onDateRangeChange, dateRange }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* サイドバー */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col gap-y-5 px-6 py-4">
          <div className="flex h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">コーヒー焙煎モニター</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <a href={item.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          'w-full justify-start gap-x-3',
                          'hover:bg-gray-100 hover:text-gray-900',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Button>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 pl-64">
        <div className="flex h-full flex-col">
          <header className="sticky top-0 z-10 bg-white shadow-sm">
            <div className="flex h-16 items-center gap-x-4 px-6">
              <h2 className="text-lg font-semibold text-gray-900">温度モニター</h2>
            </div>
          </header>

          <div className="flex-1 px-6 py-8">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <DateRangePicker onDateRangeChange={onDateRangeChange} />
                  <DownloadButtons dateRange={dateRange} />
                </div>
                <div className="overflow-x-auto">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

