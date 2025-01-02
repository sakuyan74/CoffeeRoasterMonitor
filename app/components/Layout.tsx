import { ReactNode } from 'react';
import DownloadButtons from './DownloadButtons';
import { DateRangePicker } from './DateRangePicker';
import { DateRange } from 'react-day-picker';

interface LayoutProps {
  children: ReactNode;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export default function Layout({ children, onDateRangeChange }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* サイドメニュー */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">コーヒー焙煎モニター</h1>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="px-4 py-2 hover:bg-gray-200">
              <a href="#" className="text-gray-700 hover:text-gray-900">温度モニター</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-6 flex justify-between items-center">
            <DateRangePicker onDateRangeChange={onDateRangeChange} />
            <DownloadButtons />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

