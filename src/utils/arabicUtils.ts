import { Testament } from '../types';

export const normalizeArabicText = (text: string): string => {
  return text
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .toLowerCase();
};

export const searchBible = (
  text: string,
  testaments: Testament[],
  matchAllWords: boolean = false,
  searchSeparateWords: boolean = false,
): { testament: string; book: string; chapter: number; verse: number; text: string }[] => {
  const searchTerms = text.trim().split(/\s+/);
  const normalizedSearchTerms = searchTerms.map(term => normalizeArabicText(term));
  const results: { testament: string; book: string; chapter: number; verse: number; text: string }[] = [];
  const seenResults = new Set<string>();

  testaments.forEach((testament) => {
    testament.books.forEach((book) => {
      book.chapters.forEach((chapter) => {
        chapter.verses.forEach((verse) => {
          const normalizedVerse = normalizeArabicText(verse.text);
          const resultKey = `${testament.name}-${book.name}-${chapter.number}-${verse.number}`;
          
          if (seenResults.has(resultKey)) return;
          
          if (searchSeparateWords) {
            const matchedTerms = normalizedSearchTerms.filter(term => 
              normalizedVerse.includes(term)
            );
            
            if (matchAllWords && matchedTerms.length === normalizedSearchTerms.length) {
              seenResults.add(resultKey);
              results.push({
                testament: testament.name,
                book: book.name,
                chapter: chapter.number,
                verse: verse.number,
                text: verse.text,
              });
            } else if (!matchAllWords && matchedTerms.length > 0) {
              seenResults.add(resultKey);
              results.push({
                testament: testament.name,
                book: book.name,
                chapter: chapter.number,
                verse: verse.number,
                text: verse.text,
              });
            }
          } else {
            if (normalizedVerse.includes(normalizeArabicText(text))) {
              seenResults.add(resultKey);
              results.push({
                testament: testament.name,
                book: book.name,
                chapter: chapter.number,
                verse: verse.number,
                text: verse.text,
              });
            }
          }
        });
      });
    });
  });

  return results;
};