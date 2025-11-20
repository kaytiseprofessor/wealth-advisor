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
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen flex flex-col`}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 flex flex-col relative overflow-x-hidden">
        
        {/* Modern Background Patterns */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 dark:bg-blue-600/10 blur-[100px]" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 dark:bg-purple-600/10 blur-[100px]" />
        </div>

        <Header 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme}
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
          selectedCountry={selectedCountry}
          onLogoClick={handleReset}
        />

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          
          {/* Navigation & Breadcrumbs */}
          {step !== AppStep.SELECT_COUNTRY && !isLoading && (
            <div className="mb-6 animate-fade-in">
              <button 
                onClick={handleBack}
                className="group flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-sm ring-1 ring-slate-200 dark:ring-slate-800"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> 
                {t.back}
              </button>
            </div>
          )}

          {/* Step 1: Country Selection */}
          {step === AppStep.SELECT_COUNTRY && (
            <section className="space-y-8 animate-slide-up">
              <div className="text-center space-y-4 py-8">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {t.selectRegion}
                </h2>
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
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
            <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse rounded-full"></div>
                <div className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-6 max-w-sm mx-auto text-center">
                   <div className="relative h-20 w-32 overflow-hidden rounded-xl shadow-md">
                     <img 
                        src={`https://flagcdn.com/w160/${selectedCountry?.code.toLowerCase()}.png`} 
                        alt="Country Flag"
                        className="w-full h-full object-cover"
                      />
                   </div>
                   <div className="space-y-2">
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t.loading}</h3>
                     <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t.loadingDesc} {selectedCountry?.name}</p>
                   </div>
                   <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex items-center justify-center min-h-[50vh] animate-fade-in">
              <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-red-100 dark:border-red-900/30">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full w-fit mx-auto mb-6">
                  <AlertTriangle className="h-10 w-10 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.errorTitle}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">{error}</p>
                <button 
                  onClick={() => selectedIncomeRange && handleIncomeSelect(selectedIncomeRange)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-red-600/20 active:scale-95 w-full"
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