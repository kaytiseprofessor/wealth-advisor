import React, { useState, useRef, useEffect } from 'react';
import { Globe2, Moon, Sun, ChevronDown, Check } from 'lucide-react';
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
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (lang: Language) => {
    onLanguageChange(lang);
    setIsLangOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-colors duration-300 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={onLogoClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
        >
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 overflow-hidden shrink-0 ring-2 ring-white dark:ring-slate-900">
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
            <span className="font-bold text-lg text-slate-900 dark:text-white leading-none tracking-tight">GlobalWealth</span>
          </div>
        </button>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative" ref={langMenuRef}>
             <button 
               onClick={() => setIsLangOpen(!isLangOpen)}
               className={`
                 flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all
                 ${isLangOpen 
                   ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white ring-2 ring-slate-200 dark:ring-slate-700' 
                   : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
               `}
             >
               <span className="text-lg leading-none">{selectedLanguage.flag}</span>
               <span className="hidden sm:block">{selectedLanguage.code.toUpperCase()}</span>
               <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
             </button>
             
             {/* Dropdown */}
             {isLangOpen && (
               <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-fade-in origin-top-right">
                 <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                   <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">Select Language</span>
                 </div>
                 <div className="max-h-[60vh] overflow-y-auto py-1 custom-scrollbar">
                   {LANGUAGES.map(lang => (
                     <button
                       key={lang.code}
                       onClick={() => handleLanguageSelect(lang)}
                       className={`
                         w-full text-left px-4 py-3 text-sm flex items-center justify-between gap-3 transition-colors
                         ${selectedLanguage.code === lang.code 
                           ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' 
                           : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}
                       `}
                     >
                       <span className="flex items-center gap-3">
                         <span className="text-xl leading-none shadow-sm rounded-sm overflow-hidden">{lang.flag}</span>
                         {lang.name}
                       </span>
                       {selectedLanguage.code === lang.code && <Check className="h-4 w-4" />}
                     </button>
                   ))}
                 </div>
               </div>
             )}
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};