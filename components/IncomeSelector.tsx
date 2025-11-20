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
  
  const countryName = (() => {
    try {
      return new Intl.DisplayNames([language], { type: 'region' }).of(country.code) || country.name;
    } catch {
      return country.name;
    }
  })();

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4 mb-2">
            <img 
              src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`} 
              alt={country.name} 
              className="h-8 w-auto rounded shadow-sm"
            />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t.incomeTitle} {countryName}
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 ml-1">
            {t.incomeDesc} {country.currencyCode}.
          </p>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {ranges.map((range, index) => (
            <button
              key={index}
              onClick={() => onSelect(range)}
              className="w-full text-left p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-5">
                <div className={`
                  w-12 h-12 flex items-center justify-center rounded-full overflow-hidden shrink-0 transition-transform group-hover:scale-105 border-2 shadow-sm
                  ${range.min === 0 ? 'border-slate-200 dark:border-slate-700 grayscale' :
                    range.min === 1 ? 'border-orange-100 dark:border-orange-900' :
                    index === ranges.length - 1 ? 'border-purple-100 dark:border-purple-900' : 
                    'border-blue-100 dark:border-blue-900'}
                `}>
                  <img 
                    src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`} 
                    alt="Flag" 
                    className={`w-full h-full object-cover ${range.min === 0 ? 'opacity-50' : 'opacity-90'}`}
                  />
                </div>
                <div>
                  <span className={`text-lg font-bold transition-colors ${range.min === 0 ? 'text-slate-500 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                    {range.label}
                  </span>
                </div>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                <ChevronRight className="h-5 w-5 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};