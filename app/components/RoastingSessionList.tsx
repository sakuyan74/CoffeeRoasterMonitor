'use client';

import { RoastingSession } from '@/lib/types';
import { SessionCard } from './SessionCard';
import { Pagination } from './Pagination';
import Link from 'next/link';

interface RoastingSessionListProps {
  sessions: RoastingSession[];
  variant?: 'simple' | 'detailed';
  baseUrl: string;
  selectedId?: string;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function RoastingSessionList({
  sessions,
  variant = 'detailed',
  baseUrl,
  selectedId,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
}: RoastingSessionListProps) {
  const totalPages = Math.ceil(sessions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentSessions = sessions.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {currentSessions.map((session) => (
          <Link
            key={session.id}
            href={`${baseUrl}/${session.id}`}
            className="block"
          >
            <SessionCard
              session={session}
              variant={variant}
              isSelected={session.id === selectedId}
            />
          </Link>
        ))}
      </div>

      {onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
} 