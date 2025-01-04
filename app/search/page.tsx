'use client';

import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, ArrowUpDown } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { RoastingSessionList } from '../components/RoastingSessionList';
import { RoastingSession } from '@/lib/types';
import { mockRoastingSessions, sortSessions, SortField, SortOrder } from '@/lib/mockData';

const ITEMS_PER_PAGE = 10;

// 利用可能なタグのリスト
const availableTags = [
  'エチオピア', 'グアテマラ', 'ブラジル',
  'フルーティ', 'チョコレート', 'ナッツ',
  '浅煎り', '中煎り', '深煎り'
];

export default function SearchPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [beanName, setBeanName] = useState('');
  const [weightRange, setWeightRange] = useState({ min: '', max: '' });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<RoastingSession[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSearch = () => {
    // 検索パラメータの構築
    const searchParams = {
      startDate: dateRange?.from,
      endDate: dateRange?.to,
      beanName: beanName || undefined,
      weightMin: weightRange.min ? parseInt(weightRange.min) : undefined,
      weightMax: weightRange.max ? parseInt(weightRange.max) : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    };

    // モックデータを使用して検索結果をフィルタリング
    let results = mockRoastingSessions.filter(session => {
      if (searchParams.startDate && new Date(session.metadata.date) < searchParams.startDate) return false;
      if (searchParams.endDate && new Date(session.metadata.date) > searchParams.endDate) return false;
      if (searchParams.beanName && !session.metadata.beanName.toLowerCase().includes(searchParams.beanName.toLowerCase())) return false;
      if (searchParams.weightMin && session.metadata.inputWeight < searchParams.weightMin) return false;
      if (searchParams.weightMax && session.metadata.inputWeight > searchParams.weightMax) return false;
      if (searchParams.tags && !searchParams.tags.every(tag => session.metadata.tags.includes(tag))) return false;
      return true;
    });

    // ソート
    results = sortSessions(results, sortField, sortOrder);

    setSearchResults(results);
    setHasSearched(true);
    setCurrentPage(1);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(order => order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    if (hasSearched) {
      const sorted = sortSessions(searchResults, field, sortOrder === 'asc' ? 'desc' : 'asc');
      setSearchResults(sorted);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // ページネーション用の計算
  const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 lg:max-w-5xl">
      <div className="grid gap-6">
        {/* 検索フォーム */}
        <div className="space-y-6 bg-gray-50 p-4 sm:p-6 rounded-lg">
          {/* 日付範囲選択 */}
          <div className="space-y-2">
            <Label>期間</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !dateRange && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'PPP', { locale: ja })} -{' '}
                        {format(dateRange.to, 'PPP', { locale: ja })}
                      </>
                    ) : (
                      format(dateRange.from, 'PPP', { locale: ja })
                    )
                  ) : (
                    <span>日付を選択</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={1}
                  locale={ja}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* 豆の名前 */}
          <div className="space-y-2">
            <Label htmlFor="beanName">豆の名前</Label>
            <Input
              id="beanName"
              value={beanName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBeanName(e.target.value)}
              placeholder="豆の名前を入力"
            />
          </div>

          {/* 豆の量範囲 */}
          <div className="space-y-2">
            <Label>豆の量 (g)</Label>
            <div className="flex gap-2 sm:gap-4">
              <div className="flex-1">
                <Input
                  type="number"
                  value={weightRange.min}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeightRange(prev => ({ ...prev, min: e.target.value }))}
                  placeholder="最小"
                />
              </div>
              <div className="flex items-center">-</div>
              <div className="flex-1">
                <Input
                  type="number"
                  value={weightRange.max}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeightRange(prev => ({ ...prev, max: e.target.value }))}
                  placeholder="最大"
                />
              </div>
            </div>
          </div>

          {/* タグ選択 */}
          <div className="space-y-2">
            <Label>タグ</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer text-xs sm:text-sm"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* 検索ボタン */}
          <Button onClick={handleSearch} className="w-full">
            検索
          </Button>
        </div>

        {/* 検索結果 */}
        {hasSearched && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort('date')}
                  className="gap-2"
                >
                  日時
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort('beanName')}
                  className="gap-2"
                >
                  豆の名前
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <RoastingSessionList
              sessions={paginatedResults}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={searchResults.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
} 