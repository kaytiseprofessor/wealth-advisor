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
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Clickable Logo Area */}
        <button 
          onClick={onLogoClick}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity focus:outline-none group"
          aria-label="Go to Home"
        >
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-600/20 flex items-center justify-center overflow-hidden h-9 w-9 group-hover:scale-105 transition-transform duration-200">
            {selectedCountry ? (
              <img 
                src={`https://flagcdn.com/w80/${selectedCountry.code.toLowerCase()}.png`} 
                alt={selectedCountry.name}
                className="h-full w-full object-cover rounded-[2px]"
              />
            ) : (
              <Globe2 className="h-5 w-5 text-white" />
            )}
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight leading-none">
              Global<span className="text-blue-600 dark:text-blue-400">Wealth</span> Advisor
            </h1>
            {selectedCountry && (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium animate-fade-in">
                {selectedCountry.name} Edition
              </span>
            )}
          </div>
        </button>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Language Selector */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <Languages className="h-4 w-4" />
              <span className="hidden sm:inline">{selectedLanguage.name}</span>
              <span className="sm:hidden">{selectedLanguage.code.toUpperCase()}</span>
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden hidden group-hover:block group-focus-within:block">
              <div className="max-h-64 overflow-y-auto py-1 no-scrollbar">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => onLanguageChange(lang)}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700
                      ${selectedLanguage.code === lang.code ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-700/50' : 'text-slate-700 dark:text-slate-300'}
                    `}
                  >
                    <span>{lang.flag}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};