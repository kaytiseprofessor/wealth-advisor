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
        // We don't change step here, just log error, maybe show a toast in future
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
        <Header 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme}
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
          selectedCountry={selectedCountry}
          onLogoClick={handleReset}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Navigation Controls */}
          {step !== AppStep.SELECT_COUNTRY && !isLoading && (
            <button 
              onClick={handleBack}
              className="mb-6 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              <ArrowLeft className="h-5 w-5" /> {t.back}
            </button>
          )}

          {/* Step 1: Country Selection */}
          {step === AppStep.SELECT_COUNTRY && (
            <section className="space-y-6">
              <div className="text-center max-w-2xl mx-auto mb-6">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                  {t.selectRegion}
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {t.regionDesc}
                </p>
              </div>

              <CountrySelector 
                onSelect={handleCountrySelect} 
                language={selectedLanguage.code} // Pass language code for dynamic country name translation
              />
            </section>
          )}

          {/* Step 2: Income Selection */}
          {step === AppStep.SELECT_INCOME && selectedCountry && (
             <IncomeSelector 
               country={selectedCountry}
               onSelect={handleIncomeSelect}
               language={selectedLanguage.code} // Pass language code for text translation
             />
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="relative z-10 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 h-32 w-48 flex items-center justify-center overflow-hidden">
                  <img 
                    src={`https://flagcdn.com/w320/${selectedCountry?.code.toLowerCase()}.png`} 
                    alt="Loading..."
                    className="w-full h-full object-cover animate-pulse"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-1.5 border-4 border-slate-50 dark:border-slate-950 shadow-sm z-20">
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">{t.loading}</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {t.loadingDesc} {selectedCountry?.name}
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="max-w-md mx-auto text-center bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-red-100 dark:border-red-900/30 mt-12">
              <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full w-fit mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">{t.errorTitle}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
              <button 
                onClick={() => selectedIncomeRange && handleIncomeSelect(selectedIncomeRange)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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