import React, { Suspense } from 'react';
import { BudgetPlan, Country } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Lightbulb, TrendingUp, Quote, Trophy, Target } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

// Lazy load the flag component
const CountryFlag = React.lazy(() => import('./CountryFlag'));

interface BudgetDashboardProps {
  plan: BudgetPlan;
  country: Country;
  onReset: () => void;
  language: string;
}

export const BudgetDashboard: React.FC<BudgetDashboardProps> = ({ plan, country, onReset, language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(country.code, {
      style: 'currency',
      currency: country.currencyCode,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* 1. Hero Summary Card */}
      <div className="bg-slate-900 dark:bg-white rounded-[2rem] p-6 sm:p-10 shadow-2xl text-white dark:text-slate-900 relative overflow-hidden">
        {/* Decorative blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 dark:bg-blue-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 dark:bg-slate-100 border border-white/10 dark:border-slate-200 backdrop-blur-md">
              <span className="text-xs font-bold uppercase tracking-wider opacity-90">{t.monthlyBlueprint}</span>
              <span className="w-1 h-1 rounded-full bg-white dark:bg-slate-900 opacity-50"></span>
              <span className="text-xs font-bold uppercase tracking-wider opacity-90">{plan.currency}</span>
            </div>
            
            <p className="text-xl sm:text-2xl leading-relaxed font-medium text-slate-100 dark:text-slate-800">
              {plan.summary}
            </p>
            
            {plan.quote && (
              <div className="flex gap-4 items-start pt-4 border-t border-white/10 dark:border-slate-200">
                <Quote className="h-6 w-6 text-blue-400 shrink-0" />
                <p className="text-slate-300 dark:text-slate-600 italic font-serif text-lg">"{plan.quote}"</p>
              </div>
            )}
          </div>

          <div className="hidden md:block">
             <div className="w-24 h-24 bg-white/10 dark:bg-slate-100 backdrop-blur-sm rounded-2xl p-2 shadow-inner rotate-3">
               <Suspense fallback={<div className="w-full h-full bg-white/10 dark:bg-slate-200 animate-pulse rounded-xl" />}>
                 <CountryFlag 
                    code={country.code} 
                    name={country.name}
                    className="w-full h-full object-cover rounded-xl shadow-sm"
                  />
               </Suspense>
             </div>
          </div>
        </div>
      </div>

      {/* 2. Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Life Goal */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
               <Trophy className="h-6 w-6" />
             </div>
             <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">{t.lifeGoal}</h3>
           </div>
           <p className="text-lg font-medium text-slate-800 dark:text-slate-200 mt-auto">
             {plan.lifeGoal}
           </p>
        </div>

        {/* Investment */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
               <TrendingUp className="h-6 w-6" />
             </div>
             <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">{t.investmentFocus}</h3>
           </div>
           <p className="text-base text-slate-600 dark:text-slate-400 mt-auto leading-relaxed">
             {plan.investmentAdvice}
           </p>
        </div>
      </div>

      {/* 3. Allocation Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row">
        <div className="p-6 md:p-8 md:w-2/5 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 flex flex-col justify-center bg-slate-50/50 dark:bg-slate-950/30">
           <div className="flex items-center gap-3 mb-6">
             <Target className="h-6 w-6 text-blue-600" />
             <h3 className="font-bold text-xl text-slate-900 dark:text-white">{t.idealAllocation}</h3>
           </div>
           <div className="space-y-3">
             {plan.breakdown.map((item) => (
               <div key={item.name} className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-3">
                   <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                   <span className="text-slate-600 dark:text-slate-400 font-medium">{item.name}</span>
                 </div>
                 <span className="font-bold text-slate-900 dark:text-white">{item.percentage}%</span>
               </div>
             ))}
           </div>
        </div>

        <div className="p-6 md:w-3/5 h-[350px] flex items-center justify-center bg-white dark:bg-slate-900">
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie
                 data={plan.breakdown as any[]}
                 cx="50%"
                 cy="50%"
                 innerRadius={80}
                 outerRadius={110}
                 paddingAngle={4}
                 dataKey="amount"
                 cornerRadius={6}
               >
                 {plan.breakdown.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.color || '#cbd5e1'} strokeWidth={0} />
                 ))}
               </Pie>
               <Tooltip 
                 formatter={(value: number) => [formatCurrency(value), 'Amount']}
                 contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', padding: '12px' }}
                 itemStyle={{ color: '#fff' }}
               />
             </PieChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Actionable Tips */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
           <Lightbulb className="h-6 w-6 text-amber-500" />
           <h3 className="font-bold text-xl text-slate-900 dark:text-white">{t.smartMoves}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {plan.actionableTips.map((tip, idx) => (
             <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors">
                <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold text-sm shadow-sm ring-1 ring-slate-100 dark:ring-slate-600">
                  {idx + 1}
                </div>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {tip}
                </p>
             </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-8 pb-4">
         <button 
           onClick={onReset}
           className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-slate-900/20 dark:shadow-none active:scale-95"
         >
           {t.startOver}
         </button>
      </div>
    </div>
  );
};