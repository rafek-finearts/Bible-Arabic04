import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  matchAllWords: boolean;
  searchSeparateWords: boolean;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  onMatchAllWordsChange: (checked: boolean) => void;
  onSearchSeparateWordsChange: (checked: boolean) => void;
  fontSize: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  matchAllWords,
  searchSeparateWords,
  onChange,
  onSearch,
  onMatchAllWordsChange,
  onSearchSeparateWordsChange,
  fontSize,
}) => {
  return (
    <div className="p-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="ابحث في الكتاب المقدس..."
            className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            style={{ fontSize: `${fontSize}px` }}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex justify-center gap-6 text-gray-600 dark:text-gray-300" style={{ fontSize: `${fontSize * 0.875}px` }}>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={searchSeparateWords}
                onChange={(e) => onSearchSeparateWordsChange(e.target.checked)}
                className="rounded text-blue-500 focus:ring-blue-500 dark:bg-gray-700"
              />
              <span>البحث عن الكلمات منفصلة</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={matchAllWords}
                onChange={(e) => onMatchAllWordsChange(e.target.checked)}
                className="rounded text-blue-500 focus:ring-blue-500 dark:bg-gray-700"
              />
              <span>تطابق جميع الكلمات في نفس الآية</span>
            </label>
          </div>
          <button
            onClick={() => onSearch(value)}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            style={{ fontSize: `${fontSize}px` }}
          >
            بحث
          </button>
        </div>
      </div>
    </div>
  );
};