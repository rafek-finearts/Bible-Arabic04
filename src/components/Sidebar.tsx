import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarProps {
  testaments: Testament[];
  selectedTestament: string | null;
  selectedBook: string | null;
  selectedChapter: number | null;
  verseSize: number; // Matches VerseDisplay's verseSize
  titleSize: number; // Matches VerseDisplay's titleSize
  onTestamentSelect: (testament: string) => void;
  onBookSelect: (book: string) => void;
  onChapterSelect: (testament: string, book: string, chapter: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  testaments,
  selectedTestament,
  selectedBook,
  selectedChapter,
  verseSize,
  titleSize,
  onTestamentSelect,
  onBookSelect,
  onChapterSelect,
}) => {
  const [expandedBooks, setExpandedBooks] = useState<string[]>([]);

  const toggleBook = (book: string) => {
    setExpandedBooks((prev) =>
      prev.includes(book) ? prev.filter((b) => b !== book) : [...prev, book]
    );
  };

  return (
    <div className="h-full" dir="rtl">
      <div className="p-4">
        {/* Title */}
        <h2
          className="font-bold mb-4"
          style={{
            fontSize: `${titleSize}px`, // Matches VerseDisplay titleSize
          }}
        >
          الكتاب المقدس
        </h2>

        {/* Testament Buttons */}
        <div className="flex gap-2 mb-4">
          {testaments.map((testament) => (
            <button
              key={testament.name}
              onClick={() => onTestamentSelect(testament.name)}
              className={`flex-1 px-3 py-2 rounded-lg ${
                selectedTestament === testament.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              style={{
                fontSize: `${verseSize}px`, // Matches VerseDisplay verseSize
              }}
            >
              {testament.name}
            </button>
          ))}
        </div>

        {/* Books and Chapters */}
        <div className="space-y-2">
          {selectedTestament &&
            testaments
              .find((t) => t.name === selectedTestament)
              ?.books.map((book) => (
                <div key={book.name}>
                  {/* Book Name */}
                  <button
                    onClick={() => toggleBook(book.name)}
                    className={`w-full text-right px-3 py-1.5 rounded-lg hover:bg-gray-50 flex items-center justify-between ${
                      selectedBook === book.name ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                    style={{
                      fontSize: `${verseSize}px`, // Matches VerseDisplay verseSize
                    }}
                  >
                    <span>{book.name}</span>
                    {expandedBooks.includes(book.name) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  {/* Chapter Buttons */}
                  {expandedBooks.includes(book.name) && (
                    <div className="grid grid-cols-10 gap-1 p-2 mr-4">
                      {book.chapters.map((chapter) => (
                        <button
                          key={chapter.number}
                          onClick={() => {
                            onTestamentSelect(selectedTestament);
                            onBookSelect(book.name);
                            onChapterSelect(
                              selectedTestament,
                              book.name,
                              chapter.number
                            );
                          }}
                          className={`p-1 rounded-md text-center ${
                            selectedChapter === chapter.number &&
                            selectedBook === book.name
                              ? 'bg-blue-600 text-white'
                              : 'hover:bg-gray-100'
                          }`}
                          style={{
                            fontSize: `${verseSize * 0.8}px`, // Adjusted smaller font size for chapters
                          }}
                        >
                          {chapter.number}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};
