import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface MenuCollapseButtonProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const MenuCollapseButton: React.FC<MenuCollapseButtonProps> = ({
  isCollapsed,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-2 left-1/2 -translate-x-1/2 z-[60] bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
      title={isCollapsed ? 'إظهار القائمة' : 'إخفاء القائمة'}
    >
      {isCollapsed ? (
        <ChevronUp className="h-5 w-5" />
      ) : (
        <ChevronDown className="h-5 w-5" />
      )}
    </button>
  );
};