import React, { useState, useMemo, Suspense } from 'react';
import { COUNTRIES, TRANSLATIONS } from '../constants';
import { Country } from '../types';
import { Search, Globe } from 'lucide-react';

// Lazy load the flag component
const CountryFlag = React.lazy(() => import('./CountryFlag'));

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
    <div className="w-full space-y-8">
      
      {/* Search & Filter Controls */}
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              block w-full pl-11 pr-4 py-4 
              rounded-2xl 
              bg-white dark:bg-slate-900 
              border-2 border-slate-100 dark:border-slate-800 
              text-slate-900 dark:text-white 
              placeholder:text-slate-400 
              shadow-sm focus:shadow-lg focus:border-blue-500 focus:ring-0 
              transition-all duration-300 outline-none text-base
            "
          />
        </div>

        {/* Region Filter Chips */}
        <div className="flex flex-wrap justify-center gap-2">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`
                px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 
                ${activeRegion === region 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md transform scale-105' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}
              `}
            >
              {region === 'All' ? (t.regions?.All || 'All') : (t.regions[region] || region)}
            </button>
          ))}
        </div>
      </div>

      {/* Countries Grid */}
      {filteredCountries.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="h-8 w-8 text-slate-300" />
          </div>
          <p className="text-slate-900 dark:text-white font-medium text-lg">
            {t.noResults}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Adjust your search or filters to find what you're looking for.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-slide-up">
          {filteredCountries.map((country) => (
            <button
              key={country.code}
              onClick={() => onSelect(country)}
              className="
                group relative flex flex-col items-center p-6 rounded-2xl 
                bg-white dark:bg-slate-900 
                border border-slate-200 dark:border-slate-800 
                hover:border-blue-500/50 dark:hover:border-blue-400/50
                shadow-sm hover:shadow-xl hover:shadow-blue-500/5 dark:hover:shadow-blue-900/10
                hover:-translate-y-1
                transition-all duration-300 
                text-center w-full
                overflow-hidden
              "
            >
              <div className="relative w-16 h-16 mb-4 rounded-full overflow-hidden shadow-md border-2 border-slate-50 dark:border-slate-800 group-hover:scale-110 transition-transform duration-300">
                <Suspense fallback={<div className="w-full h-full bg-slate-100 dark:bg-slate-800 animate-pulse" />}>
                  <CountryFlag 
                    code={country.code}
                    name={country.name}
                    className="h-full w-full object-cover"
                  />
                </Suspense>
              </div>
              
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mb-1 line-clamp-1 w-full group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {countryDisplayNames[country.code]}
              </h3>
              
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                {country.currencyCode}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};