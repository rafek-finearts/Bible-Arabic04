interface HistoryEntry {
  id: string;
  type: 'verse' | 'search-results';
  title: string;
  content: any;
  timestamp: number;
  scrollPosition?: number;
  searchOptions?: {
    matchAllWords: boolean;
    searchSeparateWords: boolean;
  };
}

const HISTORY_KEY = 'bible_app_history';
const LAST_TAB_KEY = 'bible_app_last_tab';
const FONT_SETTINGS_KEY = 'bible_app_font_settings';
const DARK_MODE_KEY = 'bible_app_dark_mode';
const SCROLL_POSITIONS_KEY = 'bible_app_scroll_positions';

export const saveToHistory = (tab: { 
  id: string; 
  type: string; 
  title: string; 
  content: any;
  scrollPosition?: number;
  searchOptions?: {
    matchAllWords: boolean;
    searchSeparateWords: boolean;
  };
}) => {
  if (tab.type !== 'verse' && tab.type !== 'search-results') return;

  const history = getHistory();
  const entry: HistoryEntry = {
    ...tab,
    timestamp: Date.now(),
  };

  const updatedHistory = [entry, ...history.filter(h => h.id !== tab.id)].slice(0, 100);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  localStorage.setItem(LAST_TAB_KEY, JSON.stringify(entry));
};

export const getHistory = (): HistoryEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
};

export const getLastTab = () => {
  try {
    return JSON.parse(localStorage.getItem(LAST_TAB_KEY) || 'null');
  } catch {
    return null;
  }
};

export interface FontSettings {
  verseSize: number;
  titleSize: number;
  globalSize: number;
}

export const DEFAULT_FONT_SETTINGS: FontSettings = {
  verseSize: 18,
  titleSize: 36,
  globalSize: 16,
};

export const saveFontSettings = (settings: FontSettings) => {
  localStorage.setItem(FONT_SETTINGS_KEY, JSON.stringify(settings));
};

export const getFontSettings = (): FontSettings => {
  try {
    return JSON.parse(localStorage.getItem(FONT_SETTINGS_KEY) || 'null') || DEFAULT_FONT_SETTINGS;
  } catch {
    return DEFAULT_FONT_SETTINGS;
  }
};

export const saveDarkMode = (isDark: boolean) => {
  localStorage.setItem(DARK_MODE_KEY, JSON.stringify(isDark));
};

export const getDarkMode = (): boolean => {
  try {
    return JSON.parse(localStorage.getItem(DARK_MODE_KEY) || 'false');
  } catch {
    return false;
  }
};

export const saveScrollPosition = (tabId: string, position: number) => {
  const positions = getScrollPositions();
  positions[tabId] = position;
  localStorage.setItem(SCROLL_POSITIONS_KEY, JSON.stringify(positions));
};

export const getScrollPositions = (): Record<string, number> => {
  try {
    return JSON.parse(localStorage.getItem(SCROLL_POSITIONS_KEY) || '{}');
  } catch {
    return {};
  }
};