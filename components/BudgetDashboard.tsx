
import React from 'react';
import { BudgetPlan, Country } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Lightbulb, Target, AlertCircle, PieChart as PieChartIcon, Quote, Trophy } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface BudgetDashboardProps {
  plan: BudgetPlan;
  country: Country;
  onReset: () => void;
  language: string;
}

export const BudgetDashboard: React.FC<BudgetDashboardProps> = ({ plan, country, onReset, language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
  
  const countryName = (() => {
    try {
      return new Intl.DisplayNames([language], { type: 'region' }).of(country.code) || country.name;
    } catch {
      return country.name;
    }
  })();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(country.code, {
      style: 'currency',
      currency: country.currencyCode,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="mt-8 space-y-8 animate-fade-in pb-12">
      {/* Summary Card (Top) */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-blue-950 dark:to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{t.monthlyBlueprint}</h2>
            </div>
            <div className="h-12 w-16 rounded-md overflow-hidden shadow-lg bg-slate-800">
               <img 
                  src={`https://flagcdn.com/w160/${country.code.toLowerCase()}.png`} 
                  alt={country.name}
                  className="w-full h-full object-cover"
                />
            </div>
          </div>
          
          {/* Motivational Quote */}
          {plan.quote && (
            <div className="mb-6 flex gap-3 relative">
              <Quote className="h-8 w-8 text-blue-400/50 shrink-0 -mt-1" />
              <p className="text-xl italic font-light text-blue-100/90">
                "{plan.quote}"
              </p>
            </div>
          )}

          <p className="text-lg text-slate-300 dark:text-slate-200 leading-relaxed max-w-4xl">
            {plan.summary}
          </p>
        </div>
      </div>

      {/* Advice Section (Middle) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Column 1: Tips */}
        <div className="space-y-8">
           {/* Life Goal Card */}
           {plan.lifeGoal && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-4 shadow-sm">
              <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-full shrink-0">
                <Trophy className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm uppercase tracking-wider font-bold text-emerald-800 dark:text-emerald-400 mb-1">
                  {t.lifeGoal}
                </h4>
                <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 leading-tight">
                  {plan.lifeGoal}
                </p>
              </div>
            </div>
          )}

          {/* Tips Grid */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-amber-500" /> 
              {t.smartMoves} {countryName}
            </h3>
            <div className="space-y-4 flex-1">
              {plan.actionableTips.map((tip, idx) => (
                <div key={idx} className="flex items-start p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-100 dark:hover:border-slate-600 transition-colors">
                  <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm mr-3 shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">#{idx + 1}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Investment/Motivation Advice */}
        <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-3xl p-8 border border-indigo-100 dark:border-indigo-900 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 -mt-4 -mr-4">
            <Target className="h-24 w-24 text-indigo-100 dark:text-indigo-900/50 rotate-12" />
          </div>
          <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-200 mb-4 flex items-center relative z-10">
            <AlertCircle className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            {t.investmentFocus}
          </h3>
          <div className="flex-1 relative z-10">
            <p className="text-indigo-800 dark:text-indigo-300 leading-relaxed text-lg whitespace-pre-wrap">
              {plan.investmentAdvice}
            </p>
          </div>
        </div>
      </div>

      {/* Graph Section (Last) */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center justify-center">
          <PieChartIcon className="h-5 w-5 mr-2 text-blue-500" /> {t.idealAllocation}
        </h3>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <div className="w-full md:w-1/2 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={plan.breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="amount"
                  label={({ percentage }) => `${percentage}%`}
                >
                  {plan.breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#cbd5e1'} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string, props: any) => [
                    `${formatCurrency(value)} (${props.payload.percentage}%)`, 
                    name
                  ]}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full md:w-1/3 space-y-4">
            {plan.breakdown.map((item) => (
              <div key={item.name} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-800 dark:text-white">{item.percentage}%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{formatCurrency(item.amount)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={onReset}
          className="px-8 py-4 bg-slate-900 dark:bg-slate-700 text-white font-medium rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          {t.startOver}
        </button>
      </div>
    </div>
  );
};
