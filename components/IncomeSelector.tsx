import React from 'react';
import { Country, IncomeRange } from '../types';
import { getIncomeRanges, TRANSLATIONS } from '../constants';
import { ChevronRight, Banknote } from 'lucide-react';

interface IncomeSelectorProps {
  country: Country;
  onSelect: (range: IncomeRange) => void;
  language: string;
}

export const IncomeSelector: React.FC<IncomeSelectorProps> = ({ country, onSelect, language }) => {
  const ranges = getIncomeRanges(country, language);
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
  
  const countryName = (() => {
    try {
      return new Intl.DisplayNames([language], { type: 'region' }).of(country.code) || country.name;
    } catch {
      return country.name;
    }
  })();

  return (
    <div className="w-full max-w-xl mx-auto animate-slide-up">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
           <div className="w-16 h-16 mx-auto mb-4 rounded-full shadow-md overflow-hidden border-4 border-white dark:border-slate-800">
             <img 
                src={`https://flagcdn.com/w160/${country.code.toLowerCase()}.png`} 
                alt={country.name} 
                className="w-full h-full object-cover"
              />
           </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {t.incomeTitle} {countryName}
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            {t.incomeDesc} <span className="font-bold text-slate-700 dark:text-slate-200">{country.currencyCode}</span>
          </p>
        </div>
        
        {/* List */}
        <div className="p-4 space-y-2">
          {ranges.map((range, index) => (
            <button
              key={index}
              onClick={() => onSelect(range)}
              className="
                w-full flex items-center justify-between p-4 rounded-xl
                bg-white dark:bg-slate-900 
                border border-slate-200 dark:border-slate-800 
                hover:border-blue-500 dark:hover:border-blue-500 
                hover:bg-blue-50/50 dark:hover:bg-blue-900/10
                hover:shadow-md hover:-translate-y-0.5
                transition-all duration-200 group
              "
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors
                  ${range.min === 0 
                    ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 group-hover:bg-white dark:group-hover:bg-slate-700' 
                    : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50'}
                `}>
                  <Banknote className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-start">
                  <span className={`text-lg font-bold ${range.min === 0 ? 'text-slate-500 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                    {range.label}
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                <ChevronRight className="h-5 w-5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};