import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { CountrySelector } from './components/CountrySelector';
import { IncomeSelector } from './components/IncomeSelector';
import { BudgetDashboard } from './components/BudgetDashboard';
import { Country, IncomeRange, BudgetPlan, Language, AppStep } from './types';
import { generateBudgetPlan } from './services/geminiService';
import { Loader2, ArrowLeft, AlertTriangle, RefreshCcw } from 'lucide-react';
import { LANGUAGES, TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.SELECT_COUNTRY);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedIncomeRange, setSelectedIncomeRange] = useState<IncomeRange | null>(null);
  const [budgetPlan, setBudgetPlan] = useState<BudgetPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Defaults
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);

  const t = TRANSLATIONS[selectedLanguage.code] || TRANSLATIONS['en'];

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
    <div className={`${isDarkMode ? 'dark' : ''} flex flex-col min-h-[100dvh]`}>
      <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 flex flex-col">
        
        <Header 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme}
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
          selectedCountry={selectedCountry}
          onLogoClick={handleReset}
        />

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
          
          {/* Back Button */}
          {step !== AppStep.SELECT_COUNTRY && !isLoading && (
            <div className="mb-6 sm:mb-8 animate-fade-in">
              <button 
                onClick={handleBack}
                className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              >
                <div className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                </div>
                {t.back}
              </button>
            </div>
          )}

          {/* Step 1: Country Selection */}
          {step === AppStep.SELECT_COUNTRY && (
            <section className="animate-fade-in flex flex-col items-center w-full">
              {/* Modern Hero Section */}
              <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-3 sm:space-y-4 px-2">
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  {/* Gradient Text effect */}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    {t.selectRegion}
                  </span>
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
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
            <div className="min-h-[50vh] flex flex-col items-center justify-center animate-fade-in py-12">
               <div className="relative px-4 w-full flex justify-center">
                 {/* Pulsing circles behind */}
                 <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse max-w-md mx-auto"></div>
                 
                 <div className="relative bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 text-center max-w-xs w-full">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 relative rounded-full overflow-hidden shadow-lg ring-4 ring-slate-50 dark:ring-slate-800 bg-slate-100">
                      <img 
                         src={`https://flagcdn.com/w160/${selectedCountry?.code.toLowerCase()}.png`} 
                         alt="Flag"
                         className="w-full h-full object-cover"
                       />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {t.loading}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                      {t.loadingDesc} {selectedCountry?.name}
                    </p>
                    <div className="flex justify-center">
                      <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                    </div>
                 </div>
               </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex items-center justify-center min-h-[40vh] animate-fade-in px-4">
              <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-xl border border-red-100 dark:border-red-900/30">
                <div className="bg-red-50 dark:bg-red-900/20 h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3">{t.errorTitle}</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed text-sm sm:text-base">{error}</p>
                <button 
                  onClick={() => selectedIncomeRange && handleIncomeSelect(selectedIncomeRange)}
                  className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <RefreshCcw className="h-5 w-5" />
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