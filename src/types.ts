export interface Verse {
  number: number;
  text: string;
}

export interface Chapter {
  number: number;
  verses: Verse[];
}

export interface Book {
  name: string;
  chapters: Chapter[];
}

export interface Testament {
  name: string;
  books: Book[];
}

export interface Tab {
  id: string;
  type: 'verse' | 'search-results' | 'navigation' | 'search-input';
  title: string;
  content: {
    testament?: string;
    book?: string;
    chapter?: number;
    verses?: Verse[];
    searchQuery?: string;
    searchResults?: Array<{
      testament: string;
      book: string;
      chapter: number;
      verse: number;
      text: string;
    }>;
  };
  isCollapsed: boolean;
}