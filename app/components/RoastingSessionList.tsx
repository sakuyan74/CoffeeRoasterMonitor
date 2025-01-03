'use client';

import { RoastingSession } from '@/lib/types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface RoastingSessionListProps {
  sessions: RoastingSession[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            currentPage === page
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

export function RoastingSessionList({ 
  sessions,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: RoastingSessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">該当する焙煎データがありません</p>
      </div>
    );
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {startItem}~{endItem}件 / {totalItems}件を表示
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <Link
            key={session.id}
            href={`/roasting/${session.id.replace('session-', '')}`}
            className="block"
          >
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <time className="text-lg font-medium text-gray-900">
                      {format(new Date(session.metadata.date), 'PPP', { locale: ja })}
                    </time>
                    <time className="text-sm text-gray-500">
                      {format(new Date(session.metadata.date), 'p', { locale: ja })}
                    </time>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-medium text-gray-900">{session.metadata.beanName}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>投入量: {session.metadata.inputWeight}g</span>
                      <span>→</span>
                      <span>焼き上がり: {session.metadata.outputWeight}g</span>
                    </div>
                    <div className="flex gap-1.5">
                      {session.metadata.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 mt-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
} 