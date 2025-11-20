
import React from 'react';
import { Country, IncomeRange } from '../types';
import { getIncomeRanges, TRANSLATIONS } from '../constants';
import { ChevronRight } from 'lucide-react';

interface IncomeSelectorProps {
  country: Country;
  onSelect: (range: IncomeRange) => void;
  language: string;
}

export const IncomeSelector: React.FC<IncomeSelectorProps> = ({ country, onSelect, language }) => {
  const ranges = getIncomeRanges(country, language);
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
  
  // We need to get the translated country name here too for the header
  const countryName = (() => {
    try {
      return new Intl.DisplayNames([language], { type: 'region' }).of(country.code) || country.name;
    } catch {
      return country.name;
    }
  })();

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <img 
              src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`} 
              alt={country.name} 
              className="h-6 w-auto rounded shadow-sm"
            />
            {t.incomeTitle} {countryName}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {t.incomeDesc} {country.currencyCode}.
          </p>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {ranges.map((range, index) => (
            <button
              key={index}
              onClick={() => onSelect(range)}
              className="w-full text-left p-6 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-10 h-10 flex items-center justify-center rounded-full overflow-hidden shrink-0 transition-transform group-hover:scale-105 border-2
                  ${range.min === 0 ? 'border-red-100 dark:border-red-900' :
                    range.min === 1 ? 'border-orange-100 dark:border-orange-900' :
                    index === ranges.length - 1 ? 'border-purple-100 dark:border-purple-900' : 
                    'border-blue-100 dark:border-blue-900'}
                `}>
                  <img 
                    src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`} 
                    alt="Flag" 
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
                <div>
                  <span className="text-lg font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                    {range.label}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
