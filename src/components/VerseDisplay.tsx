import React, { useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { highlightSearchText } from '../utils/highlightText';
import { useSwipeable } from 'react-swipeable';

interface VerseDisplayProps {
  verses: Verse[];
  testament: string;
  book: string;
  chapter: number;
  highlightedVerse: number | null;
  searchQuery?: string;
  verseSize: number;
  titleSize: number;
  onNavigate: (direction: 'prev' | 'next') => void;
  scrollPosition: number;
  onScroll: (position: number) => void;
}

export const VerseDisplay: React.FC<VerseDisplayProps> = ({
  verses,
  testament,
  book,
  chapter,
  highlightedVerse,
  searchQuery,
  verseSize,
  titleSize,
  onNavigate,
  scrollPosition,
  onScroll,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const highlightedVerseRef = useRef<HTMLDivElement>(null);

  const handlers = useSwipeable({
    onSwipedRight: () => onNavigate('prev'),
    onSwipedLeft: () => onNavigate('next'),
    trackMouse: true
  });

  useEffect(() => {
    if (contentRef.current) {
      if (highlightedVerse && highlightedVerseRef.current) {
        highlightedVerseRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (contentRef.current.scrollTop !== scrollPosition) {
        contentRef.current.scrollTop = scrollPosition;
      }
    }
  }, [highlightedVerse]);

  const handleScroll = () => {
    if (contentRef.current) {
      onScroll(contentRef.current.scrollTop);
    }
  };

  return (
    <div className="relative h-full" dir="rtl" {...handlers}>
      <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 py-4 shadow-sm">
        <div className="max-w-3xl mx-auto px-8">
          <h1 className="mb-2 dark:text-white" style={{ fontSize: `${titleSize}px` }}>
            {book} - إصحاح {chapter}
          </h1>
        </div>
      </div>
      <div 
        className="p-8 pt-4 h-full overflow-y-auto"
        ref={contentRef}
        onScroll={handleScroll}
      >
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {verses.map((verse) => (
              <div 
                key={verse.number}
                ref={verse.number === highlightedVerse ? highlightedVerseRef : null}
                className={`flex ${
                  highlightedVerse === verse.number 
                    ? 'bg-yellow-100 dark:bg-yellow-900 -mx-4 px-4 py-2 rounded-lg' 
                    : ''
                }`}
              >
                <span className="text-gray-400 dark:text-gray-500 ml-4 mt-1" style={{ fontSize: `${verseSize * 0.75}px` }}>
                  {verse.number}
                </span>
                <p 
                  className="leading-relaxed dark:text-white"
                  style={{ fontSize: `${verseSize}px` }}
                  dangerouslySetInnerHTML={{
                    __html: searchQuery 
                      ? highlightSearchText(verse.text, searchQuery)
                      : verse.text
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="fixed bottom-16 left-4 space-y-2">
        <button
          onClick={() => onNavigate('prev')}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <ChevronRight className="h-6 w-6 dark:text-white" />
        </button>
        <button
          onClick={() => onNavigate('next')}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <ChevronLeft className="h-6 w-6 dark:text-white" />
        </button>
      </div>
    </div>
  );
};
