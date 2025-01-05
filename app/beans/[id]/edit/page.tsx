import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { BeanForm } from '../../BeanForm';

export default async function EditBeanPage({
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
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">豆の編集</h1>
        <BeanForm bean={bean} />
      </div>
    </div>
  );
} 