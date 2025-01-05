'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="mb-6">
      <Label htmlFor="search">検索</Label>
      <Input
        id="search"
        type="search"
        placeholder="豆の名前、生産国、地域で検索..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="max-w-md"
      />
    </div>
  );
} 