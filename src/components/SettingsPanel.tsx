import React from 'react';
import { Settings } from 'lucide-react';

interface SettingsPanelProps {
  verseSize: number;
  titleSize: number;
  globalSize: number;
  isDarkMode: boolean;
  onVerseSizeChange: (size: number) => void;
  onTitleSizeChange: (size: number) => void;
  onGlobalSizeChange: (size: number) => void;
  onDarkModeChange: (isDark: boolean) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  verseSize,
  titleSize,
  globalSize,
  isDarkMode,
  onVerseSizeChange,
  onTitleSizeChange,
  onGlobalSizeChange,
  onDarkModeChange,
}) => {
  return (
    <div className="fixed top-4 left-16 z-50">
      <div className="relative group">
        <button
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          title="الإعدادات"
        >
          <Settings className="h-5 w-5 dark:text-white" />
        </button>
        
        <div className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <div className="p-4" dir="rtl">
            <h3 className="text-lg font-bold mb-4 dark:text-white">الإعدادات</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  حجم خط الآيات ونتائج البحث
                </label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  step="3"
                  value={verseSize}
                  onChange={(e) => onVerseSizeChange(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  حجم خط عناوين الإصحاحات
                </label>
                <input
                  type="range"
                  min="24"
                  max="96"
                  step="3"
                  value={titleSize}
                  onChange={(e) => onTitleSizeChange(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الحجم العام للخط
                </label>
                <input
                  type="range"
                  min="12"
                  max="48"
                  step="3"
                  value={globalSize}
                  onChange={(e) => onGlobalSizeChange(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span>الوضع الداكن</span>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                    <input
                      type="checkbox"
                      checked={isDarkMode}
                      onChange={(e) => onDarkModeChange(e.target.checked)}
                      className="opacity-0 w-0 h-0"
                    />
                    <span
                      className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 ${
                        isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
                      } transition-colors duration-200 rounded-full`}
                    >
                      <span
                        className={`absolute top-1 left-1 bg-white w-4 h-4 transition-transform duration-200 rounded-full ${
                          isDarkMode ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></span>
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};