'use client';

import { useState } from 'react';
import { RoastingSession } from '@/lib/types';
import { RoastingSessionList } from '@/components/RoastingSessionList';

interface SessionListProps {
  initialSessions: RoastingSession[];
}

export function SessionList({ initialSessions }: SessionListProps) {
  const [selectedSession, setSelectedSession] = useState<RoastingSession | null>(null);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">未登録セッション</h2>
      <div className="space-y-2">
        <RoastingSessionList
          sessions={initialSessions}
          variant="simple"
          baseUrl="/roasting/register"
          selectedId={selectedSession?.id}
        />
      </div>
    </div>
  );
} 