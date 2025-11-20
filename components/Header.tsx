import React from 'react';
import { Globe2, Moon, Sun, Languages } from 'lucide-react';
import { Language, Country } from '../types';
import { LANGUAGES } from '../constants';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  selectedLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  selectedCountry?: Country | null;
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  isDarkMode, 
  toggleTheme, 
  selectedLanguage, 
  onLanguageChange,
  selectedCountry,
  onLogoClick
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={onLogoClick}
          className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity group"
        >
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 overflow-hidden shrink-0">
             {selectedCountry ? (
                <img 
                  src={`https://flagcdn.com/w80/${selectedCountry.code.toLowerCase()}.png`}
                  alt="Flag"
                  className="w-full h-full object-cover"
                />
             ) : (
                <Globe2 className="h-5 w-5" />
             )}
          </div>
          <div className="flex flex-col items-start">
            <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-none tracking-tight">GlobalWealth</span>
          </div>
        </button>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <div className="relative group">
             <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors flex items-center gap-2">
               <Languages className="h-5 w-5" />
               <span className="text-xs font-medium uppercase hidden sm:block">{selectedLanguage.code}</span>
             </button>
             
             <div className="absolute right-0 top-full mt-2 w-40 py-1 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 hidden group-hover:block animate-fade-in">
               {LANGUAGES.map(lang => (
                 <button
                   key={lang.code}
                   onClick={() => onLanguageChange(lang)}
                   className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                 >
                   <span className="text-lg">{lang.flag}</span> {lang.name}
                 </button>
               ))}
             </div>
          </div>

          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};