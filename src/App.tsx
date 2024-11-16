import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { Sidebar } from './components/Sidebar';
import { TabsManager } from './components/TabsManager';
import { HistoryPanel } from './components/HistoryPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { searchBible } from './utils/arabicUtils';
import { 
  saveToHistory, 
  getLastTab, 
  saveFontSettings, 
  getFontSettings, 
  FontSettings, 
  DEFAULT_FONT_SETTINGS,
  saveDarkMode,
  getDarkMode,
  saveScrollPosition,
  getScrollPositions
} from './utils/history';
import { Tab } from './types';
import bibleData from './data/bible.json';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSeparateWords, setSearchSeparateWords] = useState(false);
  const [matchAllWords, setMatchAllWords] = useState(false);
  const [selectedTestament, setSelectedTestament] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [fontSettings, setFontSettings] = useState<FontSettings>(DEFAULT_FONT_SETTINGS);
  const [isDarkMode, setIsDarkMode] = useState(getDarkMode());
  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>(getScrollPositions());

  useEffect(() => {
    const savedSettings = getFontSettings();
    setFontSettings(savedSettings);

    // Initialize with the last opened tab or first chapter
    const lastTab = getLastTab();
    const firstTestament = bibleData[0];
    const firstBook = firstTestament.books[0];
    const firstChapter = firstBook.chapters[0];

    const initialTab: Tab = lastTab || {
      id: `verse-${firstTestament.name}-${firstBook.name}-${firstChapter.number}-initial`,
      type: 'verse',
      title: `${firstBook.name} ${firstChapter.number}`,
      content: {
        testament: firstTestament.name,
        book: firstBook.name,
        chapter: firstChapter.number,
        verses: firstChapter.verses,
        highlightedVerse: null,
      },
      isCollapsed: false
    };

    const navigationTab: Tab = {
      id: 'navigation',
      type: 'navigation',
      title: 'الكتب',
      content: {},
      isCollapsed: true
    };

    const searchTab: Tab = {
      id: 'search',
      type: 'search-input',
      title: 'البحث',
      content: {},
      isCollapsed: true
    };

    setTabs([navigationTab, searchTab, initialTab]);
    setActiveTabId(initialTab.id);
    setSelectedTestament(firstTestament.name);
    setSelectedBook(firstBook.name);
    setSelectedChapter(firstChapter.number);

    // Apply dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveDarkMode(isDarkMode);
  }, [isDarkMode]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) return;

    const results = searchBible(query, bibleData, matchAllWords, searchSeparateWords);
    
    const searchTab: Tab = {
      id: `search-results-${Date.now()}`,
      type: 'search-results',
      title: `نتائج: ${query}`,
      content: {
        searchQuery: query,
        searchResults: results,
      },
      searchOptions: {
        matchAllWords,
        searchSeparateWords,
      },
      isCollapsed: false
    };

    setTabs(prev => [...prev, searchTab]);
    setActiveTabId(searchTab.id);
    saveToHistory(searchTab);
  };

  const findAdjacentChapter = (testament: string, book: string, chapter: number, direction: 'prev' | 'next'): { testament: string; book: string; chapter: number } | null => {
    const currentTestamentIndex = bibleData.findIndex(t => t.name === testament);
    const currentTestament = bibleData[currentTestamentIndex];
    const currentBookIndex = currentTestament.books.findIndex(b => b.name === book);
    const currentBook = currentTestament.books[currentBookIndex];

    if (direction === 'next') {
      if (chapter < currentBook.chapters.length) {
        return { testament, book, chapter: chapter + 1 };
      }
      if (currentBookIndex < currentTestament.books.length - 1) {
        return { 
          testament, 
          book: currentTestament.books[currentBookIndex + 1].name, 
          chapter: 1 
        };
      }
      if (currentTestamentIndex < bibleData.length - 1) {
        return { 
          testament: bibleData[currentTestamentIndex + 1].name, 
          book: bibleData[currentTestamentIndex + 1].books[0].name, 
          chapter: 1 
        };
      }
    } else {
      if (chapter > 1) {
        return { testament, book, chapter: chapter - 1 };
      }
      if (currentBookIndex > 0) {
        const prevBook = currentTestament.books[currentBookIndex - 1];
        return { 
          testament, 
          book: prevBook.name, 
          chapter: prevBook.chapters.length 
        };
      }
      if (currentTestamentIndex > 0) {
        const prevTestament = bibleData[currentTestamentIndex - 1];
        const lastBook = prevTestament.books[prevTestament.books.length - 1];
        return { 
          testament: prevTestament.name, 
          book: lastBook.name, 
          chapter: lastBook.chapters.length 
        };
      }
    }
    return null;
  };

  const handleVerseSelection = (testament: string, book: string, chapter: number, highlightedVerse?: number) => {
    const verses = bibleData
      .find(t => t.name === testament)
      ?.books.find(b => b.name === book)
      ?.chapters.find(c => c.number === chapter)
      ?.verses || [];

    if (!verses.length) return;

    const verseTab: Tab = {
      id: `verse-${testament}-${book}-${chapter}-${Date.now()}`,
      type: 'verse',
      title: `${book} ${chapter}`,
      content: {
        testament,
        book,
        chapter,
        verses,
        highlightedVerse,
        searchQuery: highlightedVerse ? searchQuery : undefined,
      },
      isCollapsed: false
    };

    setTabs(prev => prev.map(tab => ({ ...tab, isCollapsed: true })).concat(verseTab));
    setActiveTabId(verseTab.id);
    saveToHistory(verseTab);
  };

  const handleChapterNavigation = (testament: string, book: string, chapter: number, direction: 'prev' | 'next') => {
    const adjacentChapter = findAdjacentChapter(testament, book, chapter, direction);
    if (adjacentChapter) {
      handleVerseSelection(
        adjacentChapter.testament,
        adjacentChapter.book,
        adjacentChapter.chapter
      );
    }
  };

  const handleSearchResultClick = (
    testament: string,
    book: string,
    chapter: number,
    verse: number
  ) => {
    handleVerseSelection(testament, book, chapter, verse);
  };

  const handleHistoryItemClick = (historyEntry: any) => {
    if (historyEntry.type === 'verse') {
      handleVerseSelection(
        historyEntry.content.testament,
        historyEntry.content.book,
        historyEntry.content.chapter,
        historyEntry.content.highlightedVerse
      );
    } else if (historyEntry.type === 'search-results') {
      if (historyEntry.searchOptions) {
        setMatchAllWords(historyEntry.searchOptions.matchAllWords);
        setSearchSeparateWords(historyEntry.searchOptions.searchSeparateWords);
      }
      setSearchQuery(historyEntry.content.searchQuery);
      handleSearch(historyEntry.content.searchQuery);
    }
  };

  const handleTabClose = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab?.type === 'navigation' || tab?.type === 'search-input') return;
    
    setTabs(prev => {
      const updatedTabs = prev.filter(tab => tab.id !== tabId);
      if (updatedTabs.length > 2 && updatedTabs.every(tab => tab.isCollapsed)) {
        return updatedTabs.map((tab, index) => 
          index === updatedTabs.length - 1 ? { ...tab, isCollapsed: false } : tab
        );
      }
      return updatedTabs;
    });

    if (activeTabId === tabId) {
      const remainingTabs = tabs.filter(tab => tab.id !== tabId);
      if (remainingTabs.length > 0) {
        setActiveTabId(remainingTabs[remainingTabs.length - 1].id);
      }
    }

    // Clean up scroll position
    const newPositions = { ...scrollPositions };
    delete newPositions[tabId];
    setScrollPositions(newPositions);
  };

  const handleTabClick = (tabId: string) => {
    const clickedTab = tabs.find(tab => tab.id === tabId);
    if (!clickedTab) return;

    setTabs(prev => prev.map(tab => ({
      ...tab,
      isCollapsed: tab.id === tabId ? !tab.isCollapsed : true
    })));
    
    setActiveTabId(tabId);
  };

  const handleFontSettingChange = (key: keyof FontSettings, value: number) => {
    const newSettings = { ...fontSettings, [key]: value };
    setFontSettings(newSettings);
    saveFontSettings(newSettings);
  };

  const handleScroll = (tabId: string, position: number) => {
    setScrollPositions(prev => ({ ...prev, [tabId]: position }));
    saveScrollPosition(tabId, position);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={{ fontSize: `${fontSettings.globalSize}px` }}>
      <HistoryPanel onHistoryItemClick={handleHistoryItemClick} />
      <SettingsPanel
        verseSize={fontSettings.verseSize}
        titleSize={fontSettings.titleSize}
        globalSize={fontSettings.globalSize}
        isDarkMode={isDarkMode}
        onVerseSizeChange={(size) => handleFontSettingChange('verseSize', size)}
        onTitleSizeChange={(size) => handleFontSettingChange('titleSize', size)}
        onGlobalSizeChange={(size) => handleFontSettingChange('globalSize', size)}
        onDarkModeChange={setIsDarkMode}
      />
      <TabsManager
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={handleTabClick}
        onTabClose={handleTabClose}
        onResultClick={handleSearchResultClick}
        fontSettings={fontSettings}
        scrollPositions={scrollPositions}
        onScroll={handleScroll}
        onChapterNavigate={handleChapterNavigation}
        searchProps={{
          value: searchQuery,
          matchAllWords,
          searchSeparateWords,
          onChange: setSearchQuery,
          onSearch: handleSearch,
          onMatchAllWordsChange: setMatchAllWords,
          onSearchSeparateWordsChange: setSearchSeparateWords,
        }}
        sidebarProps={{
          testaments: bibleData,
          selectedTestament,
          selectedBook,
          selectedChapter,
          onTestamentSelect: setSelectedTestament,
          onBookSelect: setSelectedBook,
          onChapterSelect: handleVerseSelection,
        }}
      />
    </div>
  );
}

export default App;