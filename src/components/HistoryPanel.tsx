import React, { useState, useRef, useEffect } from 'react';
import { History } from 'lucide-react';
import { getHistory } from '../utils/history';

interface HistoryPanelProps {
  onHistoryItemClick: (entry: any) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ onHistoryItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const history = getHistory();

  const handleItemClick = (entry: any) => {
    onHistoryItemClick(entry);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed top-4 left-4 z-50" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
        title="السجل"
      >
        <History className="h-5 w-5" />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="p-4" dir="rtl">
            <h3 className="text-lg font-bold mb-4">السجل</h3>
            <div className="space-y-2">
              {history.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => handleItemClick(entry)}
                  className="w-full text-right p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="font-medium">{entry.title}</div>
                  {entry.type === 'search-results' && entry.searchOptions && (
                    <div className="text-xs text-gray-500 mt-1">
                      {entry.searchOptions.matchAllWords && 'تطابق جميع الكلمات • '}
                      {entry.searchOptions.searchSeparateWords && 'كلمات منفصلة'}
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    {new Date(entry.timestamp).toLocaleDateString('ar')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};