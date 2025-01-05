import { BeanForm } from '../BeanForm';

export default function NewBeanPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">新規豆登録</h1>
        <BeanForm />
      </div>
    </div>
  );
} 