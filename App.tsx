import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { CountrySelector } from './components/CountrySelector';
import { IncomeSelector } from './components/IncomeSelector';
import { BudgetDashboard } from './components/BudgetDashboard';
import { Country, IncomeRange, BudgetPlan, Language, AppStep } from './types';
import { generateBudgetPlan } from './services/geminiService';
import { Loader2, ArrowLeft, AlertTriangle, RefreshCcw, Sparkles } from 'lucide-react';
import { LANGUAGES, TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.SELECT_COUNTRY);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedIncomeRange, setSelectedIncomeRange] = useState<IncomeRange | null>(null);
  const [budgetPlan, setBudgetPlan] = useState<BudgetPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize Dark Mode from LocalStorage or System Preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return document.documentElement.classList.contains('dark') || 
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);

  const t = TRANSLATIONS[selectedLanguage.code] || TRANSLATIONS['en'];

  // Apply Dark Mode to HTML Root and Save to LocalStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setStep(AppStep.SELECT_INCOME);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleIncomeSelect = useCallback(async (range: IncomeRange) => {
    setSelectedIncomeRange(range);
    if (!selectedCountry) return;

    setIsLoading(true);
    setError(null);
    setStep(AppStep.VIEW_DASHBOARD);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const plan = await generateBudgetPlan(selectedCountry, range, selectedLanguage);
      setBudgetPlan(plan);
    } catch (err) {
      console.error(err);
      setError(t.errorTitle);
      setStep(AppStep.SELECT_INCOME);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCountry, selectedLanguage, t]);

  const handleLanguageChange = async (newLang: Language) => {
    setSelectedLanguage(newLang);
    if (step === AppStep.VIEW_DASHBOARD && selectedCountry && selectedIncomeRange && !isLoading) {
      setIsLoading(true);
      try {
        const plan = await generateBudgetPlan(selectedCountry, selectedIncomeRange, newLang);
        setBudgetPlan(plan);
      } catch (err) {
        console.error("Language update failed", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    setError(null);
    if (step === AppStep.SELECT_INCOME) {
      setStep(AppStep.SELECT_COUNTRY);
      setSelectedCountry(null);
    } else if (step === AppStep.VIEW_DASHBOARD) {
      setStep(AppStep.SELECT_INCOME);
      setBudgetPlan(null);
    }
  };

  const handleReset = () => {
    setStep(AppStep.SELECT_COUNTRY);
    setSelectedCountry(null);
    setSelectedIncomeRange(null);
    setBudgetPlan(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 flex flex-col">
        
        <Header 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme}
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
          selectedCountry={selectedCountry}
          onLogoClick={handleReset}
        />

        <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          {/* Back Button */}
          {step !== AppStep.SELECT_COUNTRY && !isLoading && (
            <div className="mb-8 animate-fade-in">
              <button 
                onClick={handleBack}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <div className="p-2 rounded-full bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-900/5 group-hover:ring-slate-900/10 transition-all">
                  <ArrowLeft className="h-4 w-4" />
                </div>
                {t.back}
              </button>
            </div>
          )}

          {/* Step 1: Country Selection */}
          {step === AppStep.SELECT_COUNTRY && (
            <section className="animate-fade-in flex flex-col items-center w-full">
              {/* Hero Section */}
              <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wide mb-2">
                  <Sparkles className="h-3 w-3" />
                  AI-Powered Advisor
                </div>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                  {t.selectRegion}
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.regionDesc}
                </p>
              </div>

              <CountrySelector 
                onSelect={handleCountrySelect} 
                language={selectedLanguage.code} 
              />
            </section>
          )}

          {/* Step 2: Income Selection */}
          {step === AppStep.SELECT_INCOME && selectedCountry && (
             <IncomeSelector 
               country={selectedCountry}
               onSelect={handleIncomeSelect}
               language={selectedLanguage.code} 
             />
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
               <div className="relative mb-8">
                 {/* Abstract Background */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                 
                 <div className="relative bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10 text-center max-w-xs w-full aspect-square flex flex-col items-center justify-center">
                    <div className="w-24 h-24 mb-6 relative rounded-full overflow-hidden shadow-lg ring-4 ring-slate-50 dark:ring-slate-800 bg-slate-100">
                      <img 
                         src={`https://flagcdn.com/w160/${selectedCountry?.code.toLowerCase()}.png`} 
                         alt="Flag"
                         className="w-full h-full object-cover"
                       />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {t.loading}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {selectedCountry?.name}
                    </p>
                 </div>
                 
                 <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg ring-1 ring-slate-900/5">
                       <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                    </div>
                 </div>
               </div>
               
               <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">
                 {t.loadingDesc}
               </p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex items-center justify-center py-20 animate-fade-in">
              <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl ring-1 ring-slate-900/5 dark:ring-white/10">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.errorTitle}</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8">{error}</p>
                <button 
                  onClick={() => selectedIncomeRange && handleIncomeSelect(selectedIncomeRange)}
                  className="w-full py-3 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <RefreshCcw className="h-4 w-4" />
                  {t.tryAgain}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Dashboard */}
          {step === AppStep.VIEW_DASHBOARD && budgetPlan && selectedCountry && !isLoading && (
            <BudgetDashboard 
              plan={budgetPlan} 
              country={selectedCountry}
              onReset={handleReset}
              language={selectedLanguage.code}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;