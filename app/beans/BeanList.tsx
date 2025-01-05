'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreVertical } from 'lucide-react';
import { Bean } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface BeanListProps {
  beans: Bean[];
}

export function BeanList({ beans }: BeanListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Bean | null>(null);

  // 検索クエリに基づいて豆をフィルタリング
  const filteredBeans = beans.filter(bean =>
    bean.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bean.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (bean.region && bean.region.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = async (bean: Bean) => {
    try {
      const response = await fetch(`/api/beans?id=${bean.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete bean');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting bean:', error);
      // TODO: エラー処理
    }
  };

  return (
    <>
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">豆情報一覧</h1>
        <Button asChild>
          <Link href="/beans/new" className="inline-flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            新規登録
          </Link>
        </Button>
      </div>

      {/* 検索フォーム */}
      <div className="mb-6">
        <Label htmlFor="search">検索</Label>
        <Input
          id="search"
          type="search"
          placeholder="豆の名前、生産国、地域で検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* 豆一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBeans.map(bean => (
          <div
            key={bean.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold mb-2">{bean.name}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/beans/${bean.id}`}>
                      詳細
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/beans/${bean.id}/edit`}>
                      編集
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => setDeleteTarget(bean)}
                  >
                    削除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">生産国:</span> {bean.country}
                {bean.region && ` / ${bean.region}`}
              </p>
              {bean.farm && (
                <p>
                  <span className="font-medium">農園:</span> {bean.farm}
                </p>
              )}
              <p>
                <span className="font-medium">精製方法:</span> {bean.process}
              </p>
              {bean.elevation && (
                <p>
                  <span className="font-medium">標高:</span> {bean.elevation}m
                </p>
              )}
            </div>
            {bean.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {bean.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 検索結果が0件の場合 */}
      {filteredBeans.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          検索条件に一致する豆は見つかりませんでした。
        </div>
      )}

      {/* 削除確認ダイアログ */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>豆の削除</AlertDialogTitle>
            <AlertDialogDescription>
              「{deleteTarget?.name}」を削除してもよろしいですか？
              この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) {
                  handleDelete(deleteTarget);
                  setDeleteTarget(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 