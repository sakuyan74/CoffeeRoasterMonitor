'use client';

import { useRouter } from 'next/navigation';
import { Bean } from '@/lib/types';
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

interface DeleteBeanDialogProps {
  bean: Bean | null;
  onClose: () => void;
}

export function DeleteBeanDialog({ bean, onClose }: DeleteBeanDialogProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!bean) return;

    try {
      const response = await fetch(`/api/beans?id=${bean.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete bean');
      }

      router.refresh();
      onClose();
    } catch (error) {
      console.error('Error deleting bean:', error);
      // TODO: エラー処理
    }
  };

  return (
    <AlertDialog open={!!bean} onOpenChange={() => onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>豆の削除</AlertDialogTitle>
          <AlertDialogDescription>
            「{bean?.name}」を削除してもよろしいですか？
            この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            削除する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 