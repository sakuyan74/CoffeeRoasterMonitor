import { prisma } from '@/lib/prisma';
import { SessionList } from './SessionList';

export default async function RoastingRegisterListPage() {
  const sessions = await prisma.roastingSession.findMany({
    where: {
      status: 'INCOMPLETE'
    },
    include: {
      timePoints: true,
      bean: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">未登録の焙煎一覧</h1>

      {!sessions || sessions.length === 0 ? (
        <p className="text-center py-12 text-gray-500">
          未登録の焙煎セッションがありません
        </p>
      ) : (
        <SessionList initialSessions={sessions} />
      )}
    </div>
  );
} 