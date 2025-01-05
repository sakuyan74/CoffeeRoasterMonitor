import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Badge } from './ui/badge';
import { ChevronRight } from 'lucide-react';
import { RoastingSession } from '@/lib/types';

interface SessionCardProps {
  session: RoastingSession;
  variant?: 'simple' | 'detailed';
  isSelected?: boolean;
}

export function SessionCard({ session, variant = 'detailed', isSelected = false }: SessionCardProps) {
  return (
    <div className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${
      isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-200'
    }`}>
      {variant === 'simple' ? (
        // シンプル表示（未登録焙煎一覧用）
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <time className="text-base sm:text-lg font-medium text-gray-900">
              {format(new Date(session.date), 'PPP', { locale: ja })}
            </time>
            <time className="block text-xs sm:text-sm text-gray-500">
              {format(new Date(session.date), 'p', { locale: ja })}
            </time>
          </div>
        </div>
      ) : (
        // 詳細表示（焙煎履歴一覧用）
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 min-w-0 flex-1">
            <div className="flex flex-col gap-1">
              <time className="text-base sm:text-lg font-medium text-gray-900 line-clamp-1">
                {format(new Date(session.date), 'PPP', { locale: ja })}
              </time>
              <time className="text-xs sm:text-sm text-gray-500">
                {format(new Date(session.date), 'p', { locale: ja })}
              </time>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-1">
                {session.bean?.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                <span>投入量: {session.inputWeight}g</span>
                <span className="hidden sm:inline">→</span>
                <span>焼き上がり: {session.outputWeight}g</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {session.bean?.tags?.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
        </div>
      )}
    </div>
  );
} 