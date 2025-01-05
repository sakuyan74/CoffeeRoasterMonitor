import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { RoastingForm } from './RoastingForm';
import { prisma } from '@/lib/prisma';

interface Props {
  params: {
    id: string;
  };
}

export default async function RoastingRegisterPage({ params }: Props) {
  const [session, beans] = await Promise.all([
    prisma.roastingSession.findUnique({
      where: { id: params.id },
      include: {
        timePoints: true,
        bean: true,
      },
    }),
    prisma.bean.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!session) {
    return <div>セッションが見つかりません</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">焙煎登録</h1>

      <div className="mb-8 p-4 border rounded-lg bg-muted">
        <Label className="text-sm text-muted-foreground">焙煎日時</Label>
        <p className="text-lg font-medium">
          {format(new Date(session.date), 'PPP p', { locale: ja })}
        </p>
      </div>

      <RoastingForm session={session} beans={beans} />
      <Toaster />
    </div>
  );
} 