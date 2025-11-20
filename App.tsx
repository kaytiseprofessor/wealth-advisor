import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { CountrySelector } from './components/CountrySelector';
import { IncomeSelector } from './components/IncomeSelector';
import { BudgetDashboard } from './components/BudgetDashboard';
import { Country, IncomeRange, BudgetPlan, Language, AppStep } from './types';
import { generateBudgetPlan } from './services/geminiService';
import { Loader2, ArrowLeft } from 'lucide-react';
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

  // Get current translations
  const t = TRANSLATIONS[selectedLanguage.code] || TRANSLATIONS['en'];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

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

    try {
      const plan = await generateBudgetPlan(selectedCountry, range, selectedLanguage);
      setBudgetPlan(plan);
    } catch (err) {
      console.error(err);
      setError(t.errorTitle);
      setStep(AppStep.SELECT_INCOME); // Go back to income select on error
    } finally {
      setIsLoading(false);
    }
  }, [selectedCountry, selectedLanguage, t]);

  // Dynamic Language Switching
  const handleLanguageChange = async (newLang: Language) => {
    setSelectedLanguage(newLang);
    
    // If we are already viewing a dashboard, regenerate it in the new language immediately
    if (step === AppStep.VIEW_DASHBOARD && selectedCountry && selectedIncomeRange && !isLoading) {
      setIsLoading(true);
      try {
        // Pass newLang explicitly to ensure we use the updated language for the API call
        const plan = await generateBudgetPlan(selectedCountry, selectedIncomeRange, newLang);
        setBudgetPlan(plan);
      } catch (err) {
        console.error("Failed to update language for dashboard", err);
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
    <div className={`${isDarkMode ? 'dark' : ''} flex flex-col min-h-screen`}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 flex flex-col">
        <Header 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme}
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
          selectedCountry={selectedCountry}
          onLogoClick={handleReset}
        />

        <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          
          {/* Navigation Controls */}
          {step !== AppStep.SELECT_COUNTRY && !isLoading && (
            <button 
              onClick={handleBack}
              className="mb-6 inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" /> {t.back}
            </button>
          )}

          {/* Step 1: Country Selection */}
          {step === AppStep.SELECT_COUNTRY && (
            <section className="space-y-8 animate-fade-in">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                  {t.selectRegion}
                </h2>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
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
            <div className="flex flex-col items-center justify-center py-20 sm:py-32 animate-fade-in">
              <div className="relative mb-10 group">
                <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 animate-pulse"></div>
                <div className="relative z-10 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800">
                  <div className="relative h-32 w-48 overflow-hidden rounded-xl">
                    <img 
                      src={`https://flagcdn.com/w320/${selectedCountry?.code.toLowerCase()}.png`} 
                      alt="Loading..."
                      className="w-full h-full object-cover animate-pulse"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-3 -right-3 bg-blue-600 text-white p-2 rounded-full shadow-lg border-4 border-slate-50 dark:border-slate-950 z-20">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">{t.loading}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {t.loadingDesc} <span className="text-blue-600 dark:text-blue-400">{selectedCountry?.name}</span>
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="max-w-md mx-auto text-center bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-red-100 dark:border-red-900/30 mt-12 animate-fade-in">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-3">{t.errorTitle}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">{error}</p>
              <button 
                onClick={() => selectedIncomeRange && handleIncomeSelect(selectedIncomeRange)}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-600/20"
              >
                {t.tryAgain}
              </button>
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