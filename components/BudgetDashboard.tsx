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
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Summary Card (Top) */}
      <div className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden ring-1 ring-white/10">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full -ml-10 -mb-10 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-sm font-medium text-blue-100">
                 <span>{countryName}</span>
                 <span className="opacity-50">•</span>
                 <span>{plan.currency}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                {t.monthlyBlueprint}
              </h2>
            </div>
            <div className="h-14 w-20 rounded-xl overflow-hidden shadow-2xl ring-4 ring-white/10 bg-slate-800 shrink-0">
               <img 
                  src={`https://flagcdn.com/w160/${country.code.toLowerCase()}.png`} 
                  alt={country.name}
                  className="w-full h-full object-cover"
                />
            </div>
          </div>
          
          {/* Motivational Quote */}
          {plan.quote && (
            <div className="mb-8 flex gap-4 relative bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
              <Quote className="h-8 w-8 text-blue-400 shrink-0" />
              <p className="text-lg sm:text-xl italic font-light text-blue-50 leading-relaxed">
                "{plan.quote}"
              </p>
            </div>
          )}

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-4xl">
            {plan.summary}
          </p>
        </div>
      </div>

      {/* Advice Section (Middle) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Column 1: Tips */}
        <div className="flex flex-col gap-6 h-full">
           {/* Life Goal Card */}
           {plan.lifeGoal && (
            <div className="bg-emerald-50/80 dark:bg-emerald-900/10 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-900/30 flex flex-col sm:flex-row items-start gap-5 shadow-sm">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3.5 rounded-2xl shrink-0 text-emerald-600 dark:text-emerald-400">
                <Trophy className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1.5">
                  {t.lifeGoal}
                </h4>
                <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100 leading-tight">
                  {plan.lifeGoal}
                </p>
              </div>
            </div>
          )}

          {/* Tips Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800 flex-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-xl">
                <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-500" />
              </div>
              {t.smartMoves} {countryName}
            </h3>
            <div className="space-y-4">
              {plan.actionableTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all group">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold text-xs shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Investment/Motivation Advice */}
        <div className="bg-indigo-50 dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-indigo-100 dark:border-slate-800 relative overflow-hidden flex flex-col shadow-lg h-full">
          <div className="absolute -top-10 -right-10 opacity-10 dark:opacity-5">
            <Target className="h-64 w-64 text-indigo-600 rotate-12" />
          </div>
          
          <h3 className="text-xl font-bold text-indigo-950 dark:text-white mb-6 flex items-center gap-3 relative z-10">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-xl">
              <AlertCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            {t.investmentFocus}
          </h3>
          
          <div className="flex-1 relative z-10 bg-white/60 dark:bg-slate-950/50 p-6 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/10 backdrop-blur-sm">
            <p className="text-slate-700 dark:text-slate-300 leading-loose text-base sm:text-lg whitespace-pre-wrap">
              {plan.investmentAdvice}
            </p>
          </div>
        </div>
      </div>

      {/* Graph Section (Last) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-100 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-10 flex items-center justify-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl">
            <PieChartIcon className="h-5 w-5 text-blue-600 dark:text-blue-500" />
          </div>
          {t.idealAllocation}
        </h3>
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20">
          <div className="w-full lg:w-1/2 h-[350px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={plan.breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="amount"
                  label={({ percentage }) => `${percentage}%`}
                  labelLine={false}
                  cornerRadius={8}
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
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', padding: '12px 16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}
                  itemStyle={{ color: '#fff', fontWeight: 500 }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  wrapperStyle={{ paddingTop: '40px', fontSize: '14px', fontWeight: 500 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full lg:w-1/3 space-y-3">
            {plan.breakdown.map((item) => (
              <div key={item.name} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white dark:ring-slate-900" style={{ backgroundColor: item.color }}></div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-white text-lg">{item.percentage}%</div>
                  <div className="text-xs font-medium text-slate-400">{formatCurrency(item.amount)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={onReset}
          className="px-10 py-4 bg-slate-900 dark:bg-blue-600 text-white text-lg font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-slate-900/20 dark:shadow-blue-600/20 hover:shadow-2xl"
        >
          {t.startOver}
        </button>
      </div>
    </div>
  );
};