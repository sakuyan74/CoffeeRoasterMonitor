'use client';

import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RoastingSessionList } from '@/components/RoastingSessionList';
import { RoastingSession } from '@/lib/types';

const ITEMS_PER_PAGE = 10;

// 利用可能なタグのリスト
const availableTags = [
  'エチオピア', 'グアテマラ', 'ブラジル',
  'フルーティ', 'チョコレート', 'ナッツ',
  '浅煎り', '中煎り', '深煎り'
];

// 検索パラメータの型を更新
interface SearchParams {
  dateRange?: { from: Date; to: Date };
  beanName?: string;
  weightRange?: { min: number; max: number };
  tags?: string[];
  tempRange?: { min: number; max: number };
  humidityRange?: { min: number; max: number };
}

export default function RoastingSessionListPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [beanName, setBeanName] = useState('');
  const [weightRange, setWeightRange] = useState({ min: '', max: '' });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<RoastingSession[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [tempRange, setTempRange] = useState('');
  const [humidityRange, setHumidityRange] = useState('');

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        sortBy,
        sortOrder,
        ...(beanName && { search: beanName }),
      });

      // 気温範囲
      if (tempRange) {
        const [min, max] = tempRange.split('-').map(Number);
        if (!isNaN(min) && !isNaN(max)) {
          params.append('tempMin', min.toString());
          params.append('tempMax', max.toString());
        }
      }

      // 湿度範囲
      if (humidityRange) {
        const [min, max] = humidityRange.split('-').map(Number);
        if (!isNaN(min) && !isNaN(max)) {
          params.append('humidityMin', min.toString());
          params.append('humidityMax', max.toString());
        }
      }

      const response = await fetch(`/api/roasting-sessions/completed?${params}`);
      if (!response.ok) throw new Error('Failed to fetch sessions');
      
      const data = await response.json();
      setSearchResults(data.sessions);
      setTotalItems(data.total || data.sessions.length);
      setTotalPages(data.totalPages || Math.ceil(data.sessions.length / ITEMS_PER_PAGE));
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasSearched) {
      fetchSessions();
    }
  }, [currentPage, sortBy, sortOrder]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchSessions();
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(order => order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* 日付範囲 */}
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
                  <span>期間を選択</span>
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
                numberOfMonths={2}
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

        {/* 気温範囲 */}
        <div className="space-y-2">
          <Label>気温範囲 (℃)</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="最小"
              value={tempRange?.split('-')[0] || ''}
              onChange={(e) => {
                const min = e.target.value;
                const max = tempRange?.split('-')[1] || '';
                setTempRange(`${min}-${max}`);
              }}
              className="w-24"
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="最大"
              value={tempRange?.split('-')[1] || ''}
              onChange={(e) => {
                const min = tempRange?.split('-')[0] || '';
                const max = e.target.value;
                setTempRange(`${min}-${max}`);
              }}
              className="w-24"
            />
          </div>
        </div>

        {/* 湿度範囲 */}
        <div className="space-y-2">
          <Label>湿度範囲 (%)</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="最小"
              value={humidityRange?.split('-')[0] || ''}
              onChange={(e) => {
                const min = e.target.value;
                const max = humidityRange?.split('-')[1] || '';
                setHumidityRange(`${min}-${max}`);
              }}
              className="w-24"
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="最大"
              value={humidityRange?.split('-')[1] || ''}
              onChange={(e) => {
                const min = humidityRange?.split('-')[0] || '';
                const max = e.target.value;
                setHumidityRange(`${min}-${max}`);
              }}
              className="w-24"
            />
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
        <Button onClick={handleSearch} className="w-full" disabled={isLoading}>
          {isLoading ? '検索中...' : '検索'}
        </Button>
      </div>

      {/* 検索結果 */}
      {hasSearched && (
        <div className="mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSort('createdAt')}
                className="gap-2"
              >
                日時
                <ArrowUpDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSort('name')}
                className="gap-2"
              >
                豆の名前
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <RoastingSessionList
            sessions={searchResults}
            variant="detailed"
            baseUrl="/roasting/sessions"
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            pageSize={ITEMS_PER_PAGE}
          />
        </div>
      )}
    </div>
  );
} 