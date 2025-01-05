import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { DeleteBeanButton } from './DeleteBeanButton';

export default async function BeanDetailPage({
  params
}: {
  params: { id: string }
}) {
  const bean = await prisma.bean.findUnique({
    where: { id: params.id },
  });

  if (!bean) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* ヘッダー */}
        <div className="flex justify-between items-start gap-4">
          <h1 className="text-2xl font-bold">{bean.name}</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/beans/${bean.id}/edit`} className="inline-flex items-center">
                <Pencil className="h-4 w-4 mr-2" />
                編集
              </Link>
            </Button>
            <DeleteBeanButton id={bean.id} name={bean.name} />
          </div>
        </div>

        {/* タグ */}
        {bean.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {bean.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* 基本情報 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">生産国</p>
            <p className="font-medium">{bean.country}</p>
          </div>
          {bean.region && (
            <div className="space-y-1">
              <p className="text-sm text-gray-500">地域</p>
              <p className="font-medium">{bean.region}</p>
            </div>
          )}
          {bean.farm && (
            <div className="space-y-1">
              <p className="text-sm text-gray-500">農園</p>
              <p className="font-medium">{bean.farm}</p>
            </div>
          )}
          <div className="space-y-1">
            <p className="text-sm text-gray-500">品種</p>
            <p className="font-medium">{bean.variety}</p>
          </div>
          {bean.elevation && (
            <div className="space-y-1">
              <p className="text-sm text-gray-500">標高</p>
              <p className="font-medium">{bean.elevation}m</p>
            </div>
          )}
          <div className="space-y-1">
            <p className="text-sm text-gray-500">精製方法</p>
            <p className="font-medium">{bean.process}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">収穫年</p>
            <p className="font-medium">{bean.cropYear}</p>
          </div>
          {bean.grade && (
            <div className="space-y-1">
              <p className="text-sm text-gray-500">グレード</p>
              <p className="font-medium">{bean.grade}</p>
            </div>
          )}
        </div>

        {/* 説明 */}
        {bean.description && (
          <div className="space-y-1">
            <p className="text-sm text-gray-500">説明</p>
            <p className="text-gray-900">{bean.description}</p>
          </div>
        )}

        {/* メタデータ */}
        <div className="pt-4 border-t space-y-1">
          <p className="text-xs text-gray-500">
            作成日時: {format(new Date(bean.createdAt), 'PPP HH:mm', { locale: ja })}
          </p>
          <p className="text-xs text-gray-500">
            更新日時: {format(new Date(bean.updatedAt), 'PPP HH:mm', { locale: ja })}
          </p>
        </div>
      </div>
    </div>
  );
} 