'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bean } from '@/lib/types';

// 精製方法の選択肢
const PROCESS_OPTIONS = [
  'ウォッシュド',
  'ナチュラル',
  'ハニー',
  'アナエロビック',
  'ウェットハルド',
] as const;

// 利用可能なタグ
const AVAILABLE_TAGS = [
  'フルーティ',
  'チョコレート',
  'ナッツ',
  'フローラル',
  'スパイシー',
  'シトラス',
  'ベリー',
  'キャラメル',
  'アース',
] as const;

interface BeanFormProps {
  bean?: Bean;
}

export function BeanForm({ bean }: BeanFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: bean?.name ?? '',
    country: bean?.country ?? '',
    region: bean?.region ?? '',
    farm: bean?.farm ?? '',
    variety: bean?.variety ?? '',
    elevation: bean?.elevation,
    process: bean?.process ?? PROCESS_OPTIONS[0],
    cropYear: bean?.cropYear ?? '',
    grade: bean?.grade ?? '',
    description: bean?.description ?? '',
    tags: bean?.tags ?? [],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/beans', {
        method: bean ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bean ? { ...formData, id: bean.id } : formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save bean');
      }

      const savedBean = await response.json();
      router.push(`/beans/${savedBean.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error saving bean:', error);
      // TODO: エラー処理
    }
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本情報 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">基本情報</h2>
        
        <div className="space-y-2">
          <Label htmlFor="name">豆の名前 *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="例: エチオピア イルガチェフェ G1"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">生産国 *</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
              placeholder="例: エチオピア"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">生産地域</Label>
            <Input
              id="region"
              value={formData.region}
              onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
              placeholder="例: イルガチェフェ"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="farm">農園名</Label>
            <Input
              id="farm"
              value={formData.farm}
              onChange={(e) => setFormData(prev => ({ ...prev, farm: e.target.value }))}
              placeholder="例: ゲデブ農協"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="variety">品種</Label>
            <Input
              id="variety"
              value={formData.variety}
              onChange={(e) => setFormData(prev => ({ ...prev, variety: e.target.value }))}
              placeholder="例: ハイランド"
            />
          </div>
        </div>
      </div>

      {/* 詳細情報 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">詳細情報</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="elevation">標高 (m)</Label>
            <Input
              id="elevation"
              type="number"
              value={formData.elevation || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, elevation: e.target.value ? Number(e.target.value) : undefined }))}
              placeholder="例: 1800"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="process">精製方法 *</Label>
            <select
              id="process"
              value={formData.process}
              onChange={(e) => setFormData(prev => ({ ...prev, process: e.target.value }))}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            >
              {PROCESS_OPTIONS.map(process => (
                <option key={process} value={process}>{process}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cropYear">収穫年</Label>
            <Input
              id="cropYear"
              value={formData.cropYear}
              onChange={(e) => setFormData(prev => ({ ...prev, cropYear: e.target.value }))}
              placeholder="例: 2023"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">グレード</Label>
            <Input
              id="grade"
              value={formData.grade}
              onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
              placeholder="例: G1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>特徴タグ</Label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map(tag => (
              <Badge
                key={tag}
                variant={formData.tags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">説明</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="豆の特徴や味わいについて記述してください"
            className="h-32"
          />
        </div>
      </div>

      {/* 送信ボタン */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/beans">キャンセル</Link>
        </Button>
        <Button type="submit">{bean ? '更新する' : '登録する'}</Button>
      </div>
    </form>
  );
} 