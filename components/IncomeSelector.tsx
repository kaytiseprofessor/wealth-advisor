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
    <div className="w-full max-w-2xl mx-auto animate-slide-up px-2 sm:px-0">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 sm:p-8 text-center border-b border-slate-100 dark:border-slate-800">
           <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full shadow-md overflow-hidden border-4 border-slate-50 dark:border-slate-800">
             <img 
                src={`https://flagcdn.com/w160/${country.code.toLowerCase()}.png`} 
                alt={country.name} 
                className="w-full h-full object-cover"
              />
           </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {t.incomeTitle} {countryName}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            {t.incomeDesc} <strong>{country.currencyCode}</strong>
          </p>
        </div>
        
        <div className="p-3 sm:p-4 space-y-2 bg-slate-50 dark:bg-slate-950/50">
          {ranges.map((range, index) => (
            <button
              key={index}
              onClick={() => onSelect(range)}
              className="
                w-full flex items-center justify-between p-4 sm:p-5 
                bg-white dark:bg-slate-900 
                border border-slate-200 dark:border-slate-800 
                rounded-xl
                hover:border-blue-500 dark:hover:border-blue-500 
                hover:shadow-md hover:-translate-y-0.5
                transition-all duration-200 group
                active:bg-slate-50 dark:active:bg-slate-800
              "
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`
                  w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0
                  ${range.min === 0 
                    ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500' 
                    : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}
                `}>
                  <Banknote className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className={`text-base sm:text-lg font-bold text-left ${range.min === 0 ? 'text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                  {range.label}
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};