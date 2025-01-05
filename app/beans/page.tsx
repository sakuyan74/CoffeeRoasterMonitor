import { prisma } from '@/lib/prisma';
import { BeanList } from './BeanList';

export default async function BeansPage() {
  const beans = await prisma.bean.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <BeanList beans={beans} />
    </div>
  );
} 