import React from 'react';
import { X } from 'lucide-react';
import { Tab } from '../types';
import { VerseDisplay } from './VerseDisplay';
import { SearchResults } from './SearchResults';
import { Sidebar } from './Sidebar';
import { SearchBar } from './SearchBar';
import { FontSettings } from '../utils/history';

interface TabsManagerProps {
  tabs: Tab[];
  activeTabId: string;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onResultClick: (testament: string, book: string, chapter: number, verse: number) => void;
  fontSettings: FontSettings;
  scrollPositions: Record<string, number>;
  onScroll: (tabId: string, position: number) => void;
  onChapterNavigate: (testament: string, book: string, chapter: number, direction: 'prev' | 'next') => void;
  searchProps: {
    value: string;
    matchAllWords: boolean;
    searchSeparateWords: boolean;
    onChange: (value: string) => void;
    onSearch: (query: string) => void;
    onMatchAllWordsChange: (checked: boolean) => void;
    onSearchSeparateWordsChange: (checked: boolean) => void;
  };
  sidebarProps: {
    testaments: any[];
    selectedTestament: string | null;
    selectedBook: string | null;
    selectedChapter: number | null;
    onTestamentSelect: (testament: string) => void;
    onBookSelect: (book: string) => void;
    onChapterSelect: (testament: string, book: string, chapter: number) => void;
  };
}

export const TabsManager: React.FC<TabsManagerProps> = ({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  onResultClick,
  fontSettings,
  scrollPositions,
  onScroll,
  onChapterNavigate,
  searchProps,
  sidebarProps,
}) => {
  if (tabs.length === 0) return null;

  const activeTab = tabs.find(tab => tab.id === activeTabId);
  const isAnyTabExpanded = tabs.some(tab => !tab.isCollapsed);

  return (
    <div className="fixed inset-0 flex flex-col justify-end">
      <div className={`bg-white dark:bg-gray-800 transition-all duration-300 ${
        isAnyTabExpanded ? 'h-[calc(100%-3rem)]' : 'h-0'
      } overflow-y-auto`}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`h-full ${
              activeTabId === tab.id && !tab.isCollapsed ? 'block' : 'hidden'
            }`}
          >
            {tab.type === 'verse' && tab.content.verses && (
              <VerseDisplay
                verses={tab.content.verses}
                testament={tab.content.testament!}
                book={tab.content.book!}
                chapter={tab.content.chapter!}
                highlightedVerse={tab.content.highlightedVerse}
                searchQuery={tab.content.searchQuery}
                verseSize={fontSettings.verseSize}
                titleSize={fontSettings.titleSize}
                onNavigate={(direction) => 
                  onChapterNavigate(
                    tab.content.testament!,
                    tab.content.book!,
                    tab.content.chapter!,
                    direction
                  )
                }
                scrollPosition={scrollPositions[tab.id] || 0}
                onScroll={(position) => onScroll(tab.id, position)}
              />
            )}
            {tab.type === 'search-results' && tab.content.searchResults && (
              <SearchResults
                results={tab.content.searchResults}
                searchQuery={tab.content.searchQuery!}
                onResultClick={onResultClick}
                fontSize={fontSettings.verseSize}
              />
            )}
            {tab.type === 'navigation' && (
              <Sidebar {...sidebarProps} />
            )}
            {tab.type === 'search-input' && (
              <SearchBar {...searchProps} fontSize={fontSettings.globalSize} />
            )}
          </div>
        ))}
      </div>
      
      <div className="h-12 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center px-4">
        <div className="flex overflow-x-auto hide-scrollbar" dir="rtl">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center px-4 py-2 space-x-2 space-x-reverse border-r border-gray-200 dark:border-gray-700 ${
                activeTabId === tab.id && !tab.isCollapsed
                  ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <button
                onClick={() => onTabClick(tab.id)}
                className="flex items-center gap-2"
              >
                <span>{tab.title}</span>
              </button>
              {(tab.type !== 'navigation' && tab.type !== 'search-input') && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose(tab.id);
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};