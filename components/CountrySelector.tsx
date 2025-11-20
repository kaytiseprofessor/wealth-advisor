import React, { useState, useMemo } from 'react';
import { COUNTRIES, TRANSLATIONS } from '../constants';
import { Country } from '../types';
import { Search, MapPin } from 'lucide-react';

interface CountrySelectorProps {
  onSelect: (country: Country) => void;
  language: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ onSelect, language }) => {
  const [search, setSearch] = useState('');
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  const getDisplayName = (code: string, defaultName: string) => {
    try {
      return new Intl.DisplayNames([language], { type: 'region' }).of(code) || defaultName;
    } catch (e) {
      return defaultName;
    }
  };

  const countryDisplayNames = useMemo(() => {
    return COUNTRIES.reduce((acc, country) => {
      acc[country.code] = getDisplayName(country.code, country.name);
      return acc;
    }, {} as Record<string, string>);
  }, [language]);

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(c => {
      const displayName = countryDisplayNames[c.code].toLowerCase();
      const defaultName = c.name.toLowerCase();
      const searchLower = search.toLowerCase();
      const regionName = (t.regions[c.region] || c.region).toLowerCase();
      
      return displayName.includes(searchLower) || 
             defaultName.includes(searchLower) || 
             regionName.includes(searchLower);
    });
  }, [search, countryDisplayNames, t]);

  const groupedCountries = useMemo(() => {
    const groups: Record<string, Country[]> = {};
    filteredCountries.forEach(c => {
      if (!groups[c.region]) groups[c.region] = [];
      groups[c.region].push(c);
    });
    return groups;
  }, [filteredCountries]);

  return (
    <div className="w-full">
      {/* Sticky Search Bar */}
      {/* top-16 aligns it exactly below the 4rem (h-16) header */}
      <div className="sticky top-16 z-30 py-4 -mx-4 px-4 sm:mx-0 sm:px-0 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-sm transition-colors duration-300">
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 transition-all text-base outline-none"
          />
        </div>
      </div>
      
      {Object.keys(groupedCountries).length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="bg-slate-200 dark:bg-slate-900 inline-flex p-6 rounded-full mb-6">
            <Search className="h-10 w-10 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            {t.noResults} "<span className="font-semibold text-slate-900 dark:text-slate-200">{search}</span>"
          </p>
        </div>
      ) : (
        <div className="space-y-10 pb-12">
          {(Object.entries(groupedCountries) as [string, Country[]][]).map(([region, countries]) => (
            <div key={region} className="animate-slide-up">
              <div className="flex items-center gap-2 mb-4 px-1">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                <span className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full">
                  <MapPin className="h-3 w-3" /> {t.regions[region] || region}
                </span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => onSelect(country)}
                    className="
                      group relative flex flex-col items-start p-4 rounded-2xl 
                      bg-white dark:bg-slate-900 
                      border border-slate-200 dark:border-slate-800 
                      hover:border-blue-500 dark:hover:border-blue-500 
                      hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 
                      transition-all duration-300 
                      overflow-hidden text-left w-full h-full
                    "
                  >
                    {/* Card Content */}
                    <div className="flex flex-col w-full h-full relative z-10">
                      <div className="h-10 w-14 mb-3 rounded-md shadow-sm overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-100 dark:border-slate-700/50">
                         <img 
                          src={`https://flagcdn.com/w160/${country.code.toLowerCase()}.png`}
                          srcSet={`https://flagcdn.com/w320/${country.code.toLowerCase()}.png 2x`}
                          alt={`${country.name} flag`}
                          className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      
                      <div className="w-full">
                        <span className="block font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm mb-1 line-clamp-2">
                          {countryDisplayNames[country.code]}
                        </span>
                        <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {country.currencyCode}
                        </span>
                      </div>
                    </div>

                    {/* Subtle Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};