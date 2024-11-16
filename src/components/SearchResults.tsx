import React from 'react';
import { highlightSearchText } from '../utils/highlightText';

interface SearchResult {
  testament: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  searchQuery: string;
  onResultClick: (testament: string, book: string, chapter: number, verse: number) => void;
  fontSize: number;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  searchQuery,
  onResultClick,
  fontSize,
}) => {
  return (
    <div className="p-8" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 dark:text-white" style={{ fontSize: `${fontSize * 1.5}px` }}>
          نتائج البحث ({results.length})
        </h2>
        <div className="space-y-6">
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              onClick={() =>
                onResultClick(result.testament, result.book, result.chapter, result.verse)
              }
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold dark:text-white" style={{ fontSize: `${fontSize}px` }}>
                  {result.book} {result.chapter}:{result.verse}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400" style={{ fontSize: `${fontSize * 0.875}px` }}>
                  {result.testament}
                </span>
              </div>
              <p 
                className="text-gray-700 dark:text-gray-300" 
                style={{ fontSize: `${fontSize}px` }}
                dangerouslySetInnerHTML={{ 
                  __html: highlightSearchText(result.text, searchQuery) 
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};