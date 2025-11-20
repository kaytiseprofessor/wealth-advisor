import React, { useState, useMemo } from 'react';
import { COUNTRIES } from '../constants';
import { Country } from '../types';
import { Search, MapPin } from 'lucide-react';

interface CountrySelectorProps {
  onSelect: (country: Country) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ onSelect }) => {
  const [search, setSearch] = useState('');

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.region.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const groupedCountries = useMemo(() => {
    const groups: Record<string, Country[]> = {};
    filteredCountries.forEach(c => {
      if (!groups[c.region]) groups[c.region] = [];
      groups[c.region].push(c);
    });
    return groups;
  }, [filteredCountries]);

  return (
    <div className="w-full animate-fade-in max-w-5xl mx-auto">
      <div className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-sm pb-6 pt-2">
        <div className="relative max-w-lg mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search country (e.g., Bangladesh, Germany)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>
      
      {Object.keys(groupedCountries).length === 0 ? (
        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
          No countries found matching "{search}"
        </div>
      ) : (
        <div className="space-y-8">
          {(Object.entries(groupedCountries) as [string, Country[]][]).map(([region, countries]) => (
            <div key={region} className="animate-slide-up">
              <h3 className="text-lg font-bold text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2 px-2">
                <MapPin className="h-4 w-4" /> {region}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => onSelect(country)}
                    className="
                      group flex flex-col items-start p-4 rounded-xl border border-slate-200 dark:border-slate-800 
                      bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-500 
                      hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden relative
                    "
                  >
                    <div className="h-8 mb-3 rounded shadow-sm overflow-hidden relative">
                       <img 
                        src={`https://flagcdn.com/w160/${country.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w320/${country.code.toLowerCase()}.png 2x`}
                        alt={`${country.name} flag`}
                        className="h-full w-auto object-cover transform group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-left leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm">
                      {country.name}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
                      {country.currencyCode}
                    </span>
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