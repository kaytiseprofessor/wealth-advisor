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
      {/* Sticky Search Bar - Floating Design */}
      <div className="sticky top-20 z-30 pb-6 pt-2">
        <div className="relative max-w-lg mx-auto">
          <div className="absolute inset-0 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl rounded-2xl -m-2"></div>
          <div className="relative shadow-lg shadow-slate-200/50 dark:shadow-black/50 rounded-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-11 pr-4 py-3.5 rounded-2xl border-0 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ring-1 ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 transition-all text-base"
            />
          </div>
        </div>
      </div>
      
      {Object.keys(groupedCountries).length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="bg-slate-100 dark:bg-slate-900 inline-flex p-6 rounded-full mb-6">
            <Search className="h-10 w-10 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            {t.noResults} "<span className="font-semibold text-slate-900 dark:text-slate-200">{search}</span>"
          </p>
        </div>
      ) : (
        <div className="space-y-12 pb-12">
          {(Object.entries(groupedCountries) as [string, Country[]][]).map(([region, countries]) => (
            <div key={region} className="animate-slide-up">
              <div className="flex items-center gap-2.5 mb-5 px-1">
                <span className="bg-blue-100 dark:bg-blue-900/40 p-1.5 rounded-lg">
                  <MapPin className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                </span>
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t.regions[region] || region}
                </h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => onSelect(country)}
                    className="
                      group flex flex-col items-start p-4 rounded-2xl 
                      bg-white dark:bg-slate-900 
                      border border-slate-200 dark:border-slate-800 
                      hover:border-blue-500 dark:hover:border-blue-500 
                      hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 
                      transition-all duration-300 
                      relative overflow-hidden text-left w-full
                    "
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-slate-50 to-transparent dark:from-slate-800/50 rounded-bl-full -mr-10 -mt-10 transition-opacity"></div>
                    
                    <div className="h-9 w-auto mb-4 rounded shadow-sm overflow-hidden relative z-10 ring-1 ring-black/5 bg-slate-100 dark:bg-slate-800">
                       <img 
                        src={`https://flagcdn.com/w160/${country.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w320/${country.code.toLowerCase()}.png 2x`}
                        alt={`${country.name} flag`}
                        className="h-full w-auto object-cover transform group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="relative z-10 w-full">
                      <span className="block font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm mb-1 truncate">
                        {countryDisplayNames[country.code]}
                      </span>
                      <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {country.currencyCode}
                      </span>
                    </div>
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