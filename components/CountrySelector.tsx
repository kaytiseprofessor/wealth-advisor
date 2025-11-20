import React, { useState, useMemo } from 'react';
import { COUNTRIES, TRANSLATIONS } from '../constants';
import { Country } from '../types';
import { Search, Globe, MapPin } from 'lucide-react';

interface CountrySelectorProps {
  onSelect: (country: Country) => void;
  language: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ onSelect, language }) => {
  const [search, setSearch] = useState('');
  const [activeRegion, setActiveRegion] = useState<string>('All');
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  // Get unique regions from countries list
  const regions = useMemo(() => {
    const allRegions = Array.from(new Set(COUNTRIES.map(c => c.region)));
    return ['All', ...allRegions];
  }, []);

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
      
      // Search Logic
      const matchesSearch = displayName.includes(searchLower) || 
                            defaultName.includes(searchLower);
      
      // Region Logic
      const matchesRegion = activeRegion === 'All' || c.region === activeRegion;

      return matchesSearch && matchesRegion;
    });
  }, [search, activeRegion, countryDisplayNames]);

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      
      {/* Modern Search & Filter Section */}
      <div className="space-y-4 sm:space-y-6">
        {/* 1. Large Search Bar */}
        <div className="relative max-w-2xl mx-auto group w-full">
          <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-lg shadow-slate-200/50 dark:shadow-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-base sm:text-lg placeholder:text-slate-400 appearance-none"
          />
        </div>

        {/* 2. Region Filter Chips */}
        <div className="flex flex-wrap justify-center gap-2 px-2">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`
                px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border
                ${activeRegion === region 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-md transform scale-105' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}
              `}
            >
              {region === 'All' ? t.regions?.All || 'All Regions' : t.regions[region] || region}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {filteredCountries.length === 0 ? (
        <div className="text-center py-16 sm:py-24 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 mx-4">
          <Globe className="h-10 w-10 sm:h-12 sm:w-12 text-slate-300 mx-auto mb-4 opacity-50" />
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium">
            {t.noResults}
          </p>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 animate-slide-up">
          {filteredCountries.map((country) => (
            <button
              key={country.code}
              onClick={() => onSelect(country)}
              className="
                group relative flex flex-col items-center p-4 sm:p-5 rounded-2xl 
                bg-white dark:bg-slate-900 
                border border-slate-100 dark:border-slate-800 
                shadow-sm hover:shadow-xl hover:shadow-blue-500/5 dark:hover:shadow-blue-900/10
                hover:border-blue-500/50 dark:hover:border-blue-400/50
                transition-all duration-300 
                text-center w-full
                overflow-hidden
                active:scale-95
              "
            >
              {/* Hover Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:to-transparent dark:group-hover:from-blue-900/20 transition-all duration-300" />

              <div className="relative h-10 sm:h-12 w-14 sm:w-16 mb-3 sm:mb-4 shadow-sm rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 transform group-hover:scale-110 transition-transform duration-300">
                  <img 
                  src={`https://flagcdn.com/w160/${country.code.toLowerCase()}.png`}
                  srcSet={`https://flagcdn.com/w320/${country.code.toLowerCase()}.png 2x`}
                  alt={`${country.name} flag`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              
              <div className="relative z-10 w-full">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate w-full">
                  {countryDisplayNames[country.code]}
                </h3>
                <div className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                  {country.currencyCode}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};