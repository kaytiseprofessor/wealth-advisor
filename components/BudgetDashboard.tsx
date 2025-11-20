import React from 'react';
import { BudgetPlan, Country } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Lightbulb, Target, TrendingUp, Quote, Trophy, ArrowRight } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

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
    <div className="space-y-6 sm:space-y-8 animate-fade-in w-full">
      
      {/* 1. Hero Summary Card */}
      <div className="relative overflow-hidden bg-slate-900 dark:bg-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start justify-between">
          <div className="space-y-4 max-w-2xl w-full">
            <div className="flex items-center gap-2 text-indigo-200 font-medium text-xs sm:text-sm uppercase tracking-wider">
              <span className="bg-white/10 px-2 py-1 rounded">{t.monthlyBlueprint}</span>
              <span>•</span>
              <span>{plan.currency}</span>
            </div>
            <p className="text-lg sm:text-xl leading-relaxed text-indigo-50 font-light">
              {plan.summary}
            </p>
            
            {/* Quote Block */}
            {plan.quote && (
               <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10 flex gap-3">
                  <Quote className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400 shrink-0 mt-1" />
                  <p className="italic text-indigo-200 text-sm sm:text-base">"{plan.quote}"</p>
               </div>
            )}
          </div>

          <div className="hidden md:block shrink-0">
             <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden shadow-lg border-2 border-white/20 rotate-3">
               <img 
                  src={`https://flagcdn.com/w160/${country.code.toLowerCase()}.png`} 
                  alt={country.name}
                  className="w-full h-full object-cover"
                />
             </div>
          </div>
        </div>
      </div>

      {/* 2. Life Goal & Strategy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Life Goal */}
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 p-5 sm:p-6 rounded-3xl flex items-start gap-4">
           <div className="bg-emerald-100 dark:bg-emerald-900 p-2.5 sm:p-3 rounded-xl text-emerald-700 dark:text-emerald-400 shrink-0">
             <Trophy className="h-5 w-5 sm:h-6 sm:w-6" />
           </div>
           <div>
             <h4 className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide mb-1">{t.lifeGoal}</h4>
             <p className="text-base sm:text-lg font-semibold text-emerald-950 dark:text-emerald-100 leading-tight">{plan.lifeGoal}</p>
           </div>
        </div>

        {/* Investment Focus */}
        <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 p-5 sm:p-6 rounded-3xl flex items-start gap-4">
           <div className="bg-indigo-100 dark:bg-indigo-900 p-2.5 sm:p-3 rounded-xl text-indigo-700 dark:text-indigo-400 shrink-0">
             <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
           </div>
           <div>
             <h4 className="text-xs sm:text-sm font-bold text-indigo-800 dark:text-indigo-400 uppercase tracking-wide mb-1">{t.investmentFocus}</h4>
             <p className="text-sm sm:text-base font-medium text-indigo-950 dark:text-indigo-100 leading-relaxed">{plan.investmentAdvice}</p>
           </div>
        </div>
      </div>

      {/* 3. Chart & Allocation Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
             <Target className="h-5 w-5 text-blue-500" />
             {t.idealAllocation}
          </h3>
        </div>
        
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
           {/* Chart */}
           <div className="h-[280px] sm:h-[320px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={plan.breakdown}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={90}
                   paddingAngle={5}
                   dataKey="amount"
                 >
                   {plan.breakdown.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color || '#cbd5e1'} stroke="none" />
                   ))}
                 </Pie>
                 <Tooltip 
                   formatter={(value: number) => formatCurrency(value)}
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
                 />
                 <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  />
               </PieChart>
             </ResponsiveContainer>
           </div>

           {/* Legend List */}
           <div className="space-y-2 sm:space-y-3">
             {plan.breakdown.map((item) => (
               <div key={item.name} className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700 text-sm sm:text-base">
                 <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                   <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
                 </div>
                 <div className="text-right ml-2">
                   <span className="block font-bold text-slate-900 dark:text-white whitespace-nowrap">{item.percentage}%</span>
                   <span className="block text-xs text-slate-400">{formatCurrency(item.amount)}</span>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* 4. Actionable Steps */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-5 sm:p-6 md:p-8">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-5 sm:mb-6 flex items-center gap-2">
           <Lightbulb className="h-5 w-5 text-amber-500" />
           {t.smartMoves}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.actionableTips.map((tip, idx) => (
             <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="shrink-0 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold text-sm shadow-sm border border-slate-100 dark:border-slate-600">
                  {idx + 1}
                </div>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {tip}
                </p>
             </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-4 sm:pt-8 pb-8">
         <button 
           onClick={onReset}
           className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-transform shadow-xl active:scale-95"
         >
           {t.startOver}
         </button>
      </div>
    </div>
  );
};